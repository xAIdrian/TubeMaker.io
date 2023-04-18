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
