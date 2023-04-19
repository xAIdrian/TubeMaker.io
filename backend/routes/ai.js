const express = require("express");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  //   apiKey: process.env.OPENAI_API_KEY,
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

router.post("", async (req, res, next) => {
  console.log("🚀 ~ file: openai.js:12 ~ router.post ~ req:", req);

  let properPrompt = req.body.prompt;
  if (properPrompt === "") {
    // this needs to be another GPT prompt
    properPrompt =
      "The formation of the Nazi party in Germany in 1920 was a direct result of the Treaty of Versailles.";
  }

  createdPrompt = `You are an expert copywriter and media personality.  Your task is to generate a short youtube script in the first person as a narration for the following topic: ${properPrompt}} You are free to use any style or tone you like, but the script should include NO INSTRUCTIONS it should ONLY be the speakers part ONLY.  You may use the above text as a starting point:`;

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: createdPrompt,
    temperature: 1.2,
    max_tokens: 1500,
    top_p: 1
  });
  console.log("🚀 ~ file: openai.js:33 ~ completion:", completion)
  response = completion.data.choices[0].text;

  res
    .status(200)
    .json({
      message: "Response sent successfully",
      result: {
        id: "sampelid",
        prompt: createdPrompt,
        bulkText: response,
      },
    })
});

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