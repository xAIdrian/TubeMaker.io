const express = require("express");
const router = express.Router();
const fs = require("fs");
const shortid = require('shortid');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  //   apiKey: process.env.OPENAI_API_KEY,
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

router.get("/topic", async (req, res, next) => {
  console.log('🔥🔥🔥🔥🔥🔥🔥')
  rawPrompt = readTextFileToPrompt("backend/routes/inputprompts/youtube_topic.txt");
  try {
    /**
     * put in its own function
     */
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: rawPrompt,
      temperature: 1.2,
      max_tokens: 3000,
      top_p: 1,
      presence_penalty: 0.7,
      frequency_penalty: 0.7
    });
    response = completion.data.choices[0].text;
    res.status(200).json({
      message: "success",
      result: { topic: response },
    })
    
  } catch (error) {
    if (error.response) {
      console.log("🚀 ~ file: ai.js:31 ~ router.get ~ error.respons:", error.respons)
      res.status(403).json(error.response.data);
    } else {
      console.log("🚀 ~ file: ai.js:34 ~ router.get ~ error.message:", error.message)
      res.status(403).json(error.message);
    }
  }
});

router.post("/summary", async (req, res, next) => {
  console.log("🚀 ~ file: openai.js:12 ~ router.post ~ req:", req.body);

  let prompt = req.body.prompt;
  if (prompt === "") {
    // this needs to be another GPT prompt
    prompt = "How to make money using faceless youtube channels.";
  }

  let gptSummary = await summaryPromptCompletion(prompt);
  console.log("🚀 ~ file: ai.js:26 ~ router.post ~ gptSummary:", gptSummary)

  res.status(200).json({
    message: "success",
    result: {
      id: shortid.generate(),
      summary: gptSummary
    }
  });
});

router.post("/new/title", async (req, res, next) => {
  let summary = req.body.summary;
  let style = req.body.style;
  if (summary === "") {
    res.status(403).json({
      message: "summary is required",
    });
  }
  let gptTitle = await paramPromptCompletion(
    "backend/routes/inputprompts/youtube_title.txt",
    summary,
    style
  );
  gptTitle = gptTitle.replace('"', '')
  console.log("🚀 ~ file: ai.js:28 ~ router.post ~ gptTitle:", gptTitle)

  res.status(200).json({
    message: "success",
    result: { title: gptTitle },
  });
});

router.post("/new/description", async (req, res, next) => {
  let summary = req.body.summary;
  let style = req.body.style;
  if (summary === "") {
    res.status(403).json({
      message: "summary is required",
    });
  }
  let gptDescription = await paramPromptCompletion(
    "backend/routes/inputprompts/youtube_description.txt",
    summary,
    style
  );

  res.status(200).json({
    message: "success",
    result: { description: gptDescription },
  });
});

router.post("/new/script", async (req, res, next) => {
  let summary = req.body.summary;
  let style = req.body.style;
  let point = req.body.point;
  if (summary === "") {
    res.status(403).json({
      message: "summary is required",
    });
  }

  let gptScript = await scriptPromptCompletion(summary, style, point);
  console.log("🚀 ~ file: ai.js:34 ~ router.post ~ gptScript:", gptScript)

  res.status(200).json({
    message: "success",
    result: { script: gptScript },
  });
});

router.post("/new/tags", async (req, res, next) => {
  let summary = req.body.summary;
  if (summary === "") {
    res.status(403).json({
      message: "summary is required",
    });
  }
  let style = req.body.style;
  let gptTags = await paramPromptCompletion(
    "backend/routes/inputprompts/youtube_tags.txt",
    summary,
    style
  );

  res.status(200).json({
    message: "success",
    result: { tags: gptTags },
  });
});

async function getNewOutputCompletion(prompt) {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 3000,
      top_p: 1,
    });
    return completion.data.choices[0].text;
    
  } catch (error) {
    if (error.response) {
      console.log("🚀 ~ file: ai.js:56 ~ getNewOutputCompletion ~ error")
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log("🚀 ~ file: ai.js:61 ~ getNewOutputCompletion ~ else")
      console.log(error.message);
    }
  }
}

async function getOptimizedOutputCompletion(prompt) {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 3000,
      top_p: 1,
      presence_penalty: 0.6,
      frequency_penalty: 0.6
    });
    return completion.data.choices[0].text;
    
  } catch (error) {
    if (error.response) {
      console.log("🔥 ~ file: ai.js:56 ~ getOptimizedOutputCompletion ~ error")
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log("🔥 ~ file: ai.js:61 ~ getOptimizedOutputCompletion ~ else")
      console.log(error.message);
    }
  }
}

async function summaryPromptCompletion(inputParam) {
  summaryPrompt = readTextFileToPrompt("backend/routes/inputprompts/summary.txt"); 
  summaryPrompt = summaryPrompt.replace("<<FEED>>", inputParam);
  
  const completion = getNewOutputCompletion(summaryPrompt);
  return completion;
}

function scriptPromptCompletion(inputParam, styleParam, durationPoint) {
  scriptPrompt = readTextFileToPrompt("backend/routes/inputprompts/youtube_script.txt"); 
  scriptPrompt = scriptPrompt.replace("<<FEED>>", inputParam);
  scriptPrompt = scriptPrompt.replace("<<STYLE>>", styleParam);
  scriptPromtp = scriptPrompt.replace("<<POINT>>", durationPoint);

  const completion = getOptimizedOutputCompletion(scriptPrompt);
  return completion;
}

function paramPromptCompletion(filename, inputParam, styleParam) {
  rawPrompt = readTextFileToPrompt(filename);
  if (inputParam !== '') {
    rawPrompt = rawPrompt.replace("<<FEED>>", inputParam);
    rawPrompt = rawPrompt.replace("<<STYLE>>", styleParam);
  }

  const completion = getNewOutputCompletion(rawPrompt);
  return completion;
}

function readTextFileToPrompt(filename) {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    return data;
  } catch (err) {
    console.log("🚀 ~ file: ai.js:80 ~ readTextFileToPrompt ~ err:", err)
  }
}

module.exports = router;
