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

const TranslationService = require("../service/translation.service");

const configuration = new Configuration({
  apiKey: OPEN_AI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const translationService = new TranslationService();

const storagePath = './backend/audio'

router.get("/:videoId", async (req, res) => {
  const videoId = req.params.videoId;

  //test code
  if (videoId === 'test') { 
    res.status(200).json({
      message: "success",
      result: {
        //our extrememely long sample response
        translation: "Artificial Intelligence(AI) is an increasingly important technology that is poised to change the world in countless ways. From automating routine tasks to predicting disease outbreaks and developing new materials, AI has the potential to revolutionize every industry and every aspect of our lives. To fully take advantage of the incredible potential of AI, individuals and organizations need to stay informed about new developments in the field and invest in training and resources that will allow them to harness the power of this transformative technology. One of the keys to unlocking the power of AI is staying abreast of new developments and innovations in the field. There is a wealth of information available online and in print about the latest advances in AI, and it is essential for individuals and businesses to stay up- to - date on the latest trends and breakthroughs. This can include attending conferences and events, reading research papers, and following industry experts and thought leaders on social media and other platforms. Another important step to take is to invest in the necessary resources and infrastructure to take full advantage of AI. This can include purchasing hardware and software solutions that are optimized for AI workloads, hiring data scientists and other experts in the field, and investing in cloud computing services that can handle the massive amounts of data required for AI projects. Organizations that are willing to invest in these resources and build out their capabilities in AI will be better positioned to take advantage of the opportunities that this technology offers. Finally, partnering with other organizations and experts in the field can be a powerful way to accelerate progress in AI and stay ahead of the curve. This can include collaborating with other businesses in your industry to share data and insights, working with academic institutions to conduct research and develop new technologies, and seeking out partnerships with AI startups and other companies that are on the cutting edge of the field. In conclusion, the potential of AI is enormous, and those who are able to take advantage of this technology will be better positioned to succeed in the years to come. By staying informed, investing in resources and infrastructure, and partnering with others in the field, individuals and businesses can be among the first to fully embrace the power of AI and use it to create new opportunities and achieve their goals. With AI, the possibilities are endless, and the only limit is our imagination."
      }
    });
    const videoUrl = 'https://www.youtube.com/watch?v=XzLgw2Y8gNw'
    return;
  }

  // const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const options = {
    filter: "audioonly",
    quality: "highestaudio",
    format: "mp3",
  };

  from(ytdl.getInfo(videoUrl, options)).pipe(
    concatMap(async (info) => {
      console.log('Start processing download...')
      const stream = ytdl.downloadFromInfo(info, options);
      const filename = `${info.videoDetails.title}.mp3`;
      const filePath = `${storagePath}/${filename}`;

      ffmpeg(stream)
        .toFormat("mp3")
        .saveToFile(filePath)
        .on("error", function (err) {
          return throwError(() => new Error('🔥' + err));
        }).on("end", async function () {
          console.log("🚀 ~ file: transcribe.js:43 ~ File Downloaded!");
          const transcription = await transcribeAudio(filePath, info.videoDetails.description);
          const translations = await translationService.translateText(transcription);

          if (translations !== undefined && translations.length > 0) {
            res.status(200).json({
              message: "success",
              result: {
                translation: translations[0].translatedText,
              }
            });
            // deletefile(filePath)
          } else {
            deletefile(filePath);
            return throwError(() => new Error('🔥' + 'No translation found'));
          }
        })
    })
  ).subscribe({
    error: (err) => {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  })
});

async function deletefile(filePath) {
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
