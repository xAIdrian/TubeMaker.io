const express = require("express");
const router = express.Router();
const fs = require("fs");
const { of, map, from, throwError, concatMap, subscribe } = require("rxjs");

const ytdl = require("ytdl-core");

const ffmpegPath = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

const { Configuration, OpenAIApi } = require("openai");
const { OPEN_AI_API_KEY } = require("../../appsecrets");

const { Translate } = require('@google-cloud/translate').v2;

const configuration = new Configuration({
  apiKey: OPEN_AI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const translater = new Translate();

const storagePath = './backend/audio'

router.get("/:videoId", async (req, res) => {
  const videoId = req.params.videoId;

  // const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const videoUrl = 'https://www.youtube.com/watch?v=HTeJ7gSguwQ&pp=ygUlb25lIG1pbnV0ZSB2aWRlbyBvbiBoZWxwaW5nIGFsdHppbWVycw%3D%3D'
  const options = {
    filter: "audioonly",
    quality: "highestaudio",
    format: "mp3",
  };

  from(ytdl.getInfo(videoUrl, options)).pipe(
    concatMap(async (info) => {
      console.log('Start processing download...')
      const stream = await ytdl.downloadFromInfo(info, options);
      const filename = `${info.videoDetails.title}.mp3`;
      const filePath = `${storagePath}/${filename}`;

      await ffmpeg(stream)
        .toFormat("mp3")
        .saveToFile(filePath)
        .on("error", function (err) {
          return throwError(() => new Error('🔥' + err))
        }).on("end", async function () {
          console.log("🚀 ~ file: transcribe.js:43 ~ File Downloaded!")
          const transcription = await transcribeAudio(filePath, info.videoDetails.description)
          translater.translate(transcription, 'fr').then(results => {
            const translation = results[0];
            console.log(`Text: ${transcription}`);
            console.log(`Translation: ${translation}`);
            return translation
          })
        })
    })
  ).subscribe({
    // Be careful because this is emitt
    next: (transcript) => {
      if (transcript !== undefined) {
        console.log("🚀 ~ file: transcribe.js:45 ~ transcribeAudio ~ response:", transcript[0])
        res.status(200).json(transcript);
      }
    },
    error: (err) => {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
});


function deletefile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`File ${filePath} has been deleted.`);
  });
}

async function transcribeAudio(filePath, description) {
  console.log("🚀 ~ file: transcribe.js:86 ~ transcribeAudio ~ Transcription In Progress!")

  // Call the OpenAI API to transcribe the audio
  const response = await openai.createTranscription(
    fs.createReadStream(filePath),
    "whisper-1",
    description, // The prompt to use for transcription.
    "json", // The format of the transcription.
    1, // Temperature
    "en" // Language
  );

  // Parse the response and extract the transcribed text
  const transcript = response.data.text;
  console.log(
    "🚀 ~ file: transcribe.js:45 ~ transcribeAudio ~ response:",
    transcript
  );

  return transcript;
}

module.exports = router;
