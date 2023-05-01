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

router.get("/topic/:language", async (req, res, next) => {
  console.log("🚀 ~ file: ai.js:14 ~ router.get ~ req:", req.url, req.body)
  let language = req.params.language;
  if (language === 'en') {
    inputFile = "backend/routes/inputprompts/en/youtube_topic.txt";
  } else if (language === 'fr') {
    inputFile ="backend/routes/inputprompts/fr/youtube_topic.txt";
  } else {
    res.status(403).json({
      message: "language is required",
    });
  }

  rawPrompt = readTextFileToPrompt(inputFile);
  try {
    /**
     * put in its own function
     */
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: rawPrompt,
      temperature: 1.2,
      max_tokens: 500,
      top_p: 1,
      presence_penalty: 0.7,
      frequency_penalty: 0.7
    });
    response = completion.data.choices[0].text;
    console.log("🚀 ~ file: ai.js:41 ~ router.get ~ response:", response)
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

router.post("/summary/:language", async (req, res, next) => {
  console.log("🚀 ~ file: ai.js:57 ~ router.post ~ req:", req.url, req.body)
  let language = req.params.language;
  if (language === 'en') {
    inputFile = "backend/routes/inputprompts/en/summary.txt";
  } else if (language === 'fr') {
    inputFile = "backend/routes/inputprompts/fr/summary.txt";
  } else {
    res.status(403).json({
      message: "language is required",
    });
  }

  let prompt = req.body.prompt;
  if (prompt === "") {
    // this needs to be another GPT prompt
    prompt = "How to make money using faceless youtube channels.";
  }
  let gptSummary = await summaryPromptCompletion(inputFile, prompt);
  console.log("🚀 ~ file: ai.js:77 ~ router.post ~ gptSummary:", gptSummary)

  res.status(200).json({
    message: "success",
    result: {
      id: shortid.generate(),
      summary: gptSummary
    }
  });
});

router.post("/new/title/:language", async (req, res, next) => {
  console.log("🚀 ~ file: ai.js:85 ~ router.post ~ req:", req.url, req.body)
  let language = req.params.language;
  if (language === 'en') {
    inputFile = "backend/routes/inputprompts/en/youtube_title.txt";
  } else if (language === 'fr') {
    inputFile ="backend/routes/inputprompts/fr/youtube_title.txt";
  } else {
    res.status(403).json({
      message: "language is required",
    });
  }

  let summary = req.body.summary;
  let style = req.body.style;
  if (summary === "") {
    res.status(403).json({
      message: "summary is required",
    });
  }

  let gptTitle = await newPromptCompletion(inputFile, summary, style);
  console.log("🚀 ~ file: ai.js:112 ~ router.post ~ gptTitle:", gptTitle)

  res.status(200).json({
    message: "success",
    result: { title: gptTitle },
  });
});

router.post("/improve/title/:language", async (req, res, next) => {
  console.log("🚀 ~ file: ai.js:114 ~ router.post ~ req:", req.url, req.body)
  let language = req.params.language;
  if (language === 'en') {
    inputFile = "backend/routes/inputprompts/en/youtube_optimizer_title.txt";
  } else if (language === 'fr') {
    inputFile ="backend/routes/inputprompts/fr/youtube_optimizer_title.txt";
  } else {
    res.status(403).json({
      message: "language is required",
    });
  }

  let current = req.body.current;
  if (current === "") {
    res.status(403).json({
      message: "current is required",
    });
  }

  let gptTitle = await optimizePromptCompletion(inputFile, current);
  console.log("🚀 ~ file: ai.js:140 ~ router.post ~ gptTitle:", gptTitle)

  res.status(200).json({
    message: "success",
    result: { title: gptTitle },
  });
});

router.post("/new/description/:language", async (req, res, next) => {
  console.log("🚀 ~ file: ai.js:149 ~ router.post ~ req:", req.url, req.body)
  let language = req.params.language;
  if (language === 'en') {
    inputFile = "backend/routes/inputprompts/en/youtube_description.txt";
  } else if (language === 'fr') {
    inputFile ="backend/routes/inputprompts/fr/youtube_description.txt";
  } else {
    res.status(403).json({
      message: "language is required",
    });
  }

  let summary = req.body.summary;
  let style = req.body.style;
  if (summary === "") {
    res.status(403).json({
      message: "summary is required",
    });
  }

  let gptDescription = await newPromptCompletion(inputFile, summary, style);
  console.log("🚀 ~ file: ai.js:170 ~ router.post ~ gptDescription:", gptDescription)

  res.status(200).json({
    message: "success",
    result: { description: gptDescription },
  });
});

router.post("/improve/description/:language", async (req, res, next) => {
  console.log("🚀 ~ file: ai.js:179 ~ router.post ~ req:", req.url, req.body)
  let language = req.params.language;
  if (language === 'en') {
    inputFile = "backend/routes/inputprompts/en/youtube_optimizer_description.txt";
  } else if (language === 'fr') {
    inputFile ="backend/routes/inputprompts/fr/youtube_optimizer_description.txt";
  } else {
    res.status(403).json({
      message: "language is required",
    });
  }

  let current = req.body.current;
  if (current === "") {
    res.status(403).json({
      message: "current is required",
    });
  }

  let gptDescription = await optimizePromptCompletion(inputFile, current);
  console.log("🚀 ~ file: ai.js:199 ~ router.post ~ gptDescription:", gptDescription)

  res.status(200).json({
    message: "success",
    result: { description: gptDescription },
  });
});

/**
 * Keep in mind this is processing Script Sections
 */
router.post("/new/script/:language", async (req, res, next) => {
  console.log("🚀 ~ file: ai.js:211 ~ router.post ~ req:", req.url, req.body)
  let language = req.params.language;
  if (language === 'en') {
    inputFile = "backend/routes/inputprompts/en/youtube_script_section.txt";
  } else if (language === 'fr') {
    inputFile ="backend/routes/inputprompts/fr/youtube_script_section.txt";
  } else {
    res.status(403).json({
      message: "language is required",
    });
  }

  let summary = req.body.summary;
  let style = req.body.style;
  let point = req.body.point;
  if (summary === "") {
    res.status(403).json({
      message: "summary is required",
    });
  }

  let gptScript = await newScriptPromptCompletion(inputFile, summary, style, point);
  console.log("🛸 ~ file: ai.js:155 ~ router.post ~ gptScript:", gptScript)

  res.status(200).json({
    message: "success",
    result: { script: gptScript },
  });
});

router.post("/new/tags/:language", async (req, res, next) => {
  console.log("🚀 ~ file: ai.js:242 ~ router.post ~ req:", req.url, req.body)
  let language = req.params.language;
  if (language === 'en') {
    inputFile = "backend/routes/inputprompts/en/youtube_tags.txt";
  } else if (language === 'fr') {
    inputFile ="backend/routes/inputprompts/fr/youtube_tags.txt";
  } else {
    res.status(403).json({
      message: "language is required",
    });
  }

  let summary = req.body.summary;
  if (summary === "") {
    res.status(403).json({
      message: "summary is required",
    });
  }
  let style = req.body.style;
  let gptTags = await newPromptCompletion(inputFile, summary,style);
  console.log("🚀 ~ file: ai.js:262 ~ router.post ~ gptTags:", gptTags)

  res.status(200).json({
    message: "success",
    result: { tags: gptTags },
  });
});

router.post("/improve/tags/:language", async (req, res, next) => {
  console.log("🚀 ~ file: ai.js:271 ~ router.post ~ req:", req.url, req.body)
  let language = req.params.language;
  if (language === 'en') {
    inputFile = "backend/routes/inputprompts/en/youtube_optimizer_tags.txt";
  } else if (language === 'fr') {
    inputFile ="backend/routes/inputprompts/fr/youtube_optimizer_tags.txt";
  } else {
    res.status(403).json({
      message: "language is required",
    });
  }

  let current = req.body.current;
  if (current === "") {
    res.status(403).json({
      message: "current is required",
    });
  }
  let gptTags = await optimizePromptCompletion(inputFile, current);
  console.log("🚀 ~ file: ai.js:212 ~ router.post ~ gptTags:", gptTags)

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
      presence_penalty: 0.6,
      frequency_penalty: 0.6
    });
    return completion.data.choices[0].text;
    
  } catch (error) {
    if (error.response) {
      console.log("🛸 ~ file: ai.js:56 ~ getNewOutputCompletion ~ error")
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log("🛸 ~ file: ai.js:61 ~ getNewOutputCompletion ~ else")
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
      max_tokens: 2500,
      top_p: 1,
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

function summaryPromptCompletion(inputFile, inputParam) {
  rawPrompt = readTextFileToPrompt(inputFile); 
  summaryPrompt = rawPrompt.replace("<<FEED>>", inputParam);
  
  return getNewOutputCompletion(summaryPrompt);
}

function newScriptPromptCompletion(inputFile, inputParam, styleParam, durationPoint) {
  rawPrompt = readTextFileToPrompt(inputFile); 
  scriptPrompt = rawPrompt
    .replace("<<FEED>>", inputParam)
    .replace("<<STYLE>>", styleParam)
    .replace("<<POINT>>", durationPoint);

  return getNewOutputCompletion(scriptPrompt);
}

function newPromptCompletion(filename, inputParam, styleParam) {
  rawPrompt = readTextFileToPrompt(filename);
  if (inputParam === '') {
    console.log("🔥 ~ file: ai.js:80 ~ newPromptCompletion ~", filename, inputParam, styleParam)
    return
  }
  properPrompt = rawPrompt.replace("<<FEED>>", inputParam).replace("<<STYLE>>", styleParam);
  return getNewOutputCompletion(properPrompt);
}

function optimizePromptCompletion(filename, inputParam) {
  console.log("🚀 ~ file: ai.js:292 ~ optimizePromptCompletion ~ inputParam:", inputParam)
  rawPrompt = readTextFileToPrompt(filename);
  console.log("🚀 ~ file: ai.js:294 ~ optimizePromptCompletion ~ rawPrompt:", rawPrompt)
  if (inputParam === '') {
    console.log("🔥 ~ file: ai.js:296 ~ optimizePromptCompletion ~ inputParam:", inputParam)
    return
  }
  properPrompt = rawPrompt.replace("<<SOURCE>>", inputParam);
  console.log("🚀 ~ file: ai.js:300 ~ optimizePromptCompletion ~ properPrompt:", properPrompt)
  return getOptimizedOutputCompletion(properPrompt);
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
