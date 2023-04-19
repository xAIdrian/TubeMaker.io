const express = require("express");
const router = express.Router();
const fs = require("fs");
const shortid = require('shortid');
const { Configuration, OpenAIApi } = require("openai");
const { title } = require("process");

const configuration = new Configuration({
  //   apiKey: process.env.OPENAI_API_KEY,
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

router.post("", async (req, res, next) => {
  console.log("🚀 ~ file: openai.js:12 ~ router.post ~ req:", req);

  prompt = req.body.prompt;
  if (prompt === "") {
    // this needs to be another GPT prompt
    prompt = "How to make money using faceless youtube channels.";
  }

  style = req.body.style;
  duration = req.body.duration;

  summary = await summaryPromptCompletion(prompt);
  script = await paramPromptCompletion("youtube_script.txt", summary);
  title = await paramPromptCompletion("youtube_title.txt", summary);
  description = await paramPromptCompletion("youtube_description.txt", summary);
  tags = await paramPromptCompletion("youtube_tags.txt", summary).split(",");

  res.status(200).json({
    message: "Response sent successfully",
    result: {
      id: shortid.generate(),
      title: title,
      description: description,
      script: script,
      tags: tags
      },
  });
});

async function summaryPromptCompletion(inputParam) {
  summaryPrompt = readTextFileToPrompt("summary.txt");
  summaryPrompt.replace("{<<FEED>>", inputParam);

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: summaryPrompt,
    temperature: 0.3,
    max_tokens: 2000,
    top_p: 1,
  });
  console.log("🚀 ~ file: openai.js:33 ~ completion:", completion);
  return completion.data.choices[0].text;
}

async function paramPromptCompletion(filename, inputParam) {
  rawPrompt = readTextFileToPrompt(filename);
  rawPrompt.replace("<<FEED>>", inputParam);

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: rawPrompt,
    temperature: 0.7,
    max_tokens: 2000,
    top_p: 1,
  });
  console.log("🚀 ~ file: openai.js:33 ~ completion:", completion);
  response = completion.data.choices[0].text;
}

function readTextFileToPrompt(filename) {
  fs.readFile(filename, "utf8", function (err, data) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
    return data;
  });
}

module.exports = router;

// https://cloud.google.com/text-to-speech/docs/voices
// French (Canada)	Neural2	fr-CA	fr-CA-Neural2-A	FEMALE
// French (Canada)	Neural2	fr-CA	fr-CA-Neural2-B	MALE
// French (Canada)	Neural2	fr-CA	fr-CA-Neural2-C	FEMALE
// French (Canada)	Neural2	fr-CA	fr-CA-Neural2-D	MALE
// French (Canada)	Standard	fr-CA	fr-CA-Standard-A	FEMALE
// French (Canada)	Standard	fr-CA	fr-CA-Standard-B	MALE
// French (Canada)	Standard	fr-CA	fr-CA-Standard-C	FEMALE
// French (Canada)	Standard	fr-CA	fr-CA-Standard-D	MALE
// French (Canada)	WaveNet	fr-CA	fr-CA-Wavenet-A	FEMALE
// French (Canada)	WaveNet	fr-CA	fr-CA-Wavenet-B	MALE
// French (Canada)	WaveNet	fr-CA	fr-CA-Wavenet-C	FEMALE
// French (Canada)	WaveNet	fr-CA	fr-CA-Wavenet-D	MALE

//Language	Voice type	Language code	Voice name	     SSML Gender
// French  Neural2	     fr-FR	      "fr-FR-Neural2-A",	 FEMALE
// French  Neural2	     fr-FR	      "fr-FR-Neural2-B",	 MALE
// French  Neural2	     fr-FR	      "fr-FR-Neural2-C",	 FEMALE
// French  Neural2	     fr-FR	      "fr-FR-Neural2-D",	 MALE
// French  Neural2	     fr-FR	      "fr-FR-Neural2-E",	 FEMALE
// French  Standard     	fr-FR      	"fr-FR-Standard-A",	FEMALE
// French  Standard     	fr-FR      	"fr-FR-Standard-B",	MALE
// French  Standard     	fr-FR      	"fr-FR-Standard-C",	FEMALE
// French  Standard     	fr-FR      	"fr-FR-Standard-D",	MALE
// French  Standard     	fr-FR      	"fr-FR-Standard-E",	FEMALE
// French  WaveNet	     fr-FR	      "fr-FR-Wavenet-A",	 FEMALE
// French  WaveNet	     fr-FR	      "fr-FR-Wavenet-B",	 MALE
// French  WaveNet	     fr-FR	      "fr-FR-Wavenet-C",	 FEMALE
// French  WaveNet	     fr-FR	      "fr-FR-Wavenet-D",	 MALE
// French  WaveNet	     fr-FR	      "fr-FR-Wavenet-E",	 FEMALE
