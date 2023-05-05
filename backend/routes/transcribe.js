const express = require("express");
const router = express.Router();
const ytdl = require("ytdl-core");
const openai = require("openai");
const fs = require("fs");
const { of, Observable, catchError, from, throwError } = require("rxjs");
const ffmpegPath = require("ffmpeg-static");
console.log("🚀 ~ file: transcribe.js:8 ~ ffmpegPath:", ffmpegPath)
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

const { OPEN_AI_API_KEY } = require("../../appsecrets");

const storagePath = './backend/audio'

router.get("/:videoId", async (req, res) => {
  const videoId = req.params.videoId;

  // const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const videoUrl = 'https://www.youtube.com/watch?v=wkf-WxMZVP8'
  const options = {
    filter: "audioonly",
    quality: "highestaudio",
    format: "mp3",
  };

  // Use ytdl to download the video and pipe it to the write stream
  // const videoInfo = await ytdl.getInfo(videoUrl);

  from(ytdl.getInfo(videoUrl, options)).pipe(
    map((info) => {
      console.log('Start processing download...')
      var stream = ytdl.downloadFromInfo(info, options);
      const filename = `${info.videoDetails.title}.mp3`;
      const filePath = `${storagePath}/${filename}`;

      ffmpeg(stream)
        .toFormat("mp3")
        .saveToFile(filePath)
        .on("error", function (err) {
          return throwError(() => new Error('🔥' + err))
        }).on("end", function () {
          console.log("🚀 ~ file: transcribe.js:43 ~ File Download!")
          return of(filePath)
        })
    }))
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
  transcribeAudio(readableStream).subscribe({
    next: (transcript) => {
      console.log(
        "🚀 ~ file: transcribe.js:20 ~ this.transcribeAudio ~ transcript:",
        transcript
      );
      res.status(200).json({ transcript });
    },
    error: (err) => {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    },
  });

async function transcribeAudio(readStream) {
  openai.apiKey = OPEN_AI_API_KEY;

  // Call the OpenAI API to transcribe the audio
  const response = await openai.createTranscription(
    readStream,
    "whisper-1",
    undefined, // The prompt to use for transcription.
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

  return of(transcript);
}

module.exports = router;
