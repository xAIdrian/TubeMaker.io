const express = require("express");
const router = express.Router();
const fs = require("fs");
const { of, map, from, throwError, concatMap, subscribe } = require("rxjs");
const util = require("util");
const unlink = util.promisify(fs.unlink);
const ytdl = require("ytdl-core");

const ffmpegPath = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

const { Configuration, OpenAIApi } = require("openai");
const { OPEN_AI_API_KEY } = require("../appsecrets");

const TranslationService = require("../service/translation.service");

const configuration = new Configuration({
  apiKey: OPEN_AI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const translationService = new TranslationService();

const storagePath = "./backend/audio";

router.post("", async (req, res) => {
  const reqBody = req.body;

  const videoId = reqBody.videoId;
  const language = reqBody.language;

  if (!videoId || !language) {
    res.status(400).json({
      message: "Video ID and language are required.",
    });
    return; // Stop further execution
  }

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const options = {
    filter: "audioonly",
    quality: "highestaudio",
    format: "mp3",
  };

  try {
    from(ytdl.getInfo(videoUrl, options))
      .pipe(
        concatMap(async (info) => {
          console.log("Start processing download...");

          const stream = ytdl.downloadFromInfo(info, options);
          const cleanedString = info.videoDetails.title
            .replace(/[^a-zA-Z0-9 ]/g, "")
            .trim()
            .replace(/\s+/g, "_");
          const filename = `${cleanedString}.mp3`;
          const filePath = `${storagePath}/${filename}`;

          ffmpeg(stream)
            .toFormat("mp3")
            .saveToFile(filePath)
            .on("error", function (err) {
              return throwError(() => new Error("🔥" + err));
            })
            .on("end", async function () {
              const transcription = await transcribeAudio(filePath);

              if (transcription === undefined || transcription === "") {
                deleteFile(filePath);
                res.status(404).json({ error: "Transcription Unavailable" });
                return;
              } else {
                let translation = transcription;

                if (language === "fr") {
                  translation = await translationService.translateText(
                    transcription
                  );

                  if (translation !== undefined && translation !== "") {
                    res.status(200).json({
                      message: "success",
                      result: {
                        translation: translation,
                      },
                    });
                    deleteFile(filePath);
                  } else {
                    console.log("🔥 Translation Empty");
                    deleteFile(filePath);
                    res.status(500).json({ error: "Translations Empty" });
                    return;
                  }
                } else {
                  res.status(200).json({
                    message: "success",
                    result: {
                      translation: translation,
                    },
                  });
                  deleteFile(filePath);
                }
              }
            });
        })
      )
      .subscribe({
        error: (err) => {
          console.error(`🔥 ${err}`);
          console.error(err);
          res.status(500).json({ error: "Internal server error" });
        },
      });
  } catch (error) {
    deleteFile(filePath);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function deleteFile(filePath) {
  try {
    await unlink(filePath);
    console.log(`File ${filePath} has been deleted.`);
  } catch (error) {
    console.error(error);
  }
}

async function transcribeAudio(filePath) {
  try {
    // Call the OpenAI API to transcribe the audio
    const response = await openai.createTranscription(
      fs.createReadStream(filePath),
      "whisper-1",
      undefined, // The prompt to use for transcription.
      "json", // The format of the transcription.
      1, // Temperature
      "en", // Language
      {
        maxBodyLength: 25 * 1024 * 1024,
      }
    );
    // Parse the response and extract the transcribed text
    const transcript = response.data.text;
    return transcript;
  } catch (error) {
    deleteFile(filePath);
    return "";
  }
}

module.exports = router;
