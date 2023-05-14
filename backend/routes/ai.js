const express = require("express");
const router = express.Router();
const fs = require("fs");
const { Configuration, OpenAIApi } = require("openai");
const { OPEN_AI_API_KEY } = require("../../appsecrets");

const configuration = new Configuration({
  apiKey: OPEN_AI_API_KEY,
});
const openai = new OpenAIApi(configuration);

////////////////////
// TOPIC ///////////
///////////////////

router.get("/topic/:language", async (req, res, next) => {
  console.log("🚀 ~ file: ai.js:14 ~ router.get ~ req:", req.url, req.body)

  let language = req.params.language;

  // Validate language input
  const validLanguages = ['en', 'fr'];
  if (!validLanguages.includes(language)) {
    res.status(400).json({
      message: "Invalid language. Please provide a valid language.",
    });
    return; // Return early to avoid further processing
  } 

  rawPrompt = readTextFileToPrompt(inputFile);

  try {
    const response = await generateTopic(language);
  
    res.status(200).json({
      message: "success",
      result: { topic: response },
    });
  } catch (error) {
     console.log("🔥 ~ file: ai.js:34 ~ router.get ~ error:", error);

    if (error.response) {
      console.log("🔥 ~ file: ai.js:31 ~ router.get ~ error.response:", error.response);
      res.status(500).json({
        message: "API call failed",
        result: error.response.data,
      });
    } else {
      console.log("🔥 ~ file: ai.js:34 ~ router.get ~ error.message:", error.message);
      res.status(500).json({
        message: "Internal server error",
        result: error.message,
      });
    }
  }
});

async function generateTopic(language) {
  const inputFile = `backend/routes/inputprompts/${language}/youtube_topic.txt`;
  const rawPrompt = readTextFileToPrompt(inputFile);

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: rawPrompt,
      temperature: 1.2,
      max_tokens: 500,
      top_p: 1,
      presence_penalty: 0.7,
      frequency_penalty: 0.7,
    });

    const response = completion.data.choices[0].text;
    return response;
  } catch (error) {
    throw error;
  }
}

////////////////////
// SUMMARY /////////
///////////////////

router.post("/summary/:language", async (req, res, next) => {
  console.log("🚀 ~ file: ai.js:57 ~ router.post ~ req:", req.url, req.body)

  let language = req.params.language;
  let prompt = req.body.prompt;

  // Validate language input
  const validLanguages = ['en', 'fr'];
  if (!validLanguages.includes(language)) {
    res.status(400).json({
      message: "Invalid language. Please provide a valid language.",
    });
    return; // Return early to avoid further processing
  }

  // Validate prompt input
  if (prompt === undefined || prompt.trim() === "") {
    res.status(400).json({
      message: "Invalid prompt. Please provide a valid prompt.",
    });
    return;
  }

  try {
    const gptSummary = await generateSummary(language, prompt);
  
    res.status(200).json({
      message: "success",
      result: {
        summary: gptSummary,
      },
    });
  } catch (error) {
    console.log("🔥 ~ file: ai.js:34 ~ router.post ~ error:", error);
  
    if (error.response) {
      console.log("🔥 ~ file: ai.js:31 ~ router.post ~ error.response:", error.response);
      res.status(500).json({
        message: "API call failed",
        result: error.response.data,
      });
    } else {
      console.log("🔥 ~ file: ai.js:34 ~ router.post ~ error.message:", error.message);
      res.status(500).json({
        message: "Internal server error",
        result: error.message,
      });
    }
  }
});

async function generateSummary(language, prompt) {
  const inputFile = `backend/routes/inputprompts/${language}/summary.txt`;

  try {
    let gptSummary = await summaryPromptCompletion(inputFile, prompt);
    console.log("🚀 ~ file: ai.js:77 ~ router.post ~ gptSummary:", gptSummary);

    return gptSummary;
  } catch (error) {
    throw error;
  }
}

////////////////////
// TITLE //////////
///////////////////

router.post("/new/title/:language", async (req, res, next) => {
  console.log("🚀 ~ file: ai.js:85 ~ router.post ~ req:", req.url, req.body)

  let language = req.params.language;
  let summary = req.body.summary;
  let style = req.body.style;

  // Validate language input
  const validLanguages = ['en', 'fr'];
  if (!validLanguages.includes(language)) {
    res.status(400).json({
      message: "Invalid language. Please provide a valid language.",
    });
    return; // Return early to avoid further processing
  }

  // Validate summary input
  if (!summary) {
    res.status(400).json({
      message: "Summary is required.",
    });
    return; // Return early to avoid further processing
  }

  // Validate style input (if required)
  if (!style) {
    res.status(400).json({
      message: "Empty style. Please provide a valid style.",
    });
    return; // Return early to avoid further processing
  }

  try {
    const gptTitle = await generateTitle(language, summary, style);
  
    res.status(200).json({
      message: "success",
      result: { title: gptTitle },
    });
  } catch (error) {
    console.log("🔥 ~ file: ai.js:34 ~ router.post ~ error:", error);
  
    if (error.response) {
      console.log("🔥 ~ file: ai.js:31 ~ router.post ~ error.response:", error.response);
      res.status(400).json({
        message: "API call failed",
        result: error.response.data,
      });
    } else {
      console.log("🔥 ~ file: ai.js:34 ~ router.post ~ error.message:", error.message);
      res.status(500).json({
        message: "Internal server error",
        result: error.message,
      });
    }
  }
});

async function generateTitle(language, summary, style) {
  const inputFile = `backend/routes/inputprompts/${language}/youtube_title.txt`;

  try {
    let gptTitle = await newPromptCompletion(inputFile, summary, style);
    console.log("🚀 ~ file: ai.js:112 ~ router.post ~ gptTitle:", gptTitle);

    return gptTitle;
  } catch (error) {
    throw error;
  }
}

router.post("/improve/title/:language", async (req, res, next) => {
  console.log("🚀 ~ file: ai.js:114 ~ router.post ~ req:", req.url, req.body)
  
  let language = req.params.language;
  let current = req.body.current;
  let prompt = req.body.prompt;

  // Validate language input
  const validLanguages = ['en', 'fr'];
  if (!validLanguages.includes(language)) {
    res.status(400).json({
      message: "Invalid language. Please provide a valid language.",
    });
    return; // Return early to avoid further processing
  }

  if (current === undefined || current === '') {
    res.status(400).json({
      message: "current is required",
    });
    return;
  }

  if (prompt === undefined || prompt.trim() === "") {
    res.status(400).json({
      message: "Invalid prompt. Please provide a valid prompt.",
    });
    return;
  }

  try {
    const gptTitle = await getImprovedCompletion(language, current, prompt);
  
    res.status(200).json({
      message: "success",
      result: { title: gptTitle },
    });
  } catch (error) {
    console.log("🔥 ~ file: ai.js:34 ~ router.post ~ error:", error);
  
    if (error.response) {
      console.log("🔥 ~ file: ai.js:31 ~ router.post ~ error.response:", error.response);
      res.status(500).json({
        message: "API call failed",
        result: error.response.data,
      });
    } else {
      console.log("🔥 ~ file: ai.js:34 ~ router.post ~ error.message:", error.message);
      res.status(500).json({
        message: "Internal server error",
        result: error.message,
      });
    }
  }
});

async function getImprovedCompletion(language, current, prompt) {
  let inputFile = getImproveFileName(language, prompt);
  if (inputFile === '') {
    res.status(400).json({
      message: "Something is missing in the request body.",
    });
    return; // Stop further execution
  }

  try {
    let gptTitle = await improvePromptCompletion(inputFile, current);
    console.log("🚀 ~ file: ai.js:280 ~ improveTitle ~ gptTitle:", gptTitle)

    return gptTitle;
  } catch (error) {
    throw error;
  }
}

////////////////////
// DESCRIPTION /////
///////////////////

router.post("/new/description/:language", async (req, res, next) => {
  console.log("🚀 ~ file: ai.js:149 ~ router.post ~ req:", req.url, req.body)

  let language = req.params.language;
  let summary = req.body.summary;
  let style = req.body.style;

  if (!language || !['en', 'fr'].includes(language)) {
    res.status(400).json({
      message: "Invalid language. Language must be 'en' or 'fr'.",
    });
    return; // Stop further execution
  } 
  inputFile = `backend/routes/inputprompts/${language}/youtube_description.txt`;
  
  if (!summary) {
    res.status(400).json({
      message: "Summary is required.",
    });
    return; // Stop further execution
  }

  try {
    let gptDescription = await newPromptCompletion(inputFile, summary, style);
    console.log("🚀 ~ file: ai.js:170 ~ router.post ~ gptDescription:", gptDescription);
  
    res.status(200).json({
      message: "success",
      result: { description: gptDescription },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred while generating the description.",
      result: error.message
    });
  }
});

router.post("/improve/description/:language", async (req, res, next) => {
  console.log("🚀 ~ file: ai.js:179 ~ router.post ~ req:", req.url, req.body)
  
  let language = req.params.language;
  let current = req.body.current;
  let prompt = req.body.prompt;

  if (!language || !['en', 'fr'].includes(language)) {
    res.status(400).json({
      message: "Invalid language. Language must be 'en' or 'fr'.",
    });
    return; // Stop further execution
  } 
  
  if (!current) {
    res.status(400).json({
      message: "Current is required.",
    });
    return; // Stop further execution
  }
  
  let inputFile = getImproveFileName(language, prompt);
  if (inputFile === '') {
    res.status(400).json({
      message: "Something is missing in the request body.",
    });
    return; // Stop further execution
  }

  try {
    let gptDescription = await improvePromptCompletion(inputFile, current);
    console.log("🚀 ~ file: ai.js:199 ~ router.post ~ gptDescription:", gptDescription);
  
    res.status(200).json({
      message: "success",
      result: { description: gptDescription },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred while improving the description.",
      result: error.message
    });
  }
});

////////////////////
// SCRIPT //////////
///////////////////

router.post("/new/script/:language", async (req, res, next) => {
  console.log("🚀 ~ file: ai.js:211 ~ router.post ~ req:", req.url, req.body)

  let language = req.params.language;
  let summary = req.body.summary;
  let style = req.body.style;
  let point = req.body.point;

  if (!language || !['en', 'fr'].includes(language)) {
    res.status(400).json({
      message: "Invalid language. Language must be 'en' or 'fr'.",
    });
    return; // Stop further execution
  } 
  inputFile = `backend/routes/inputprompts/${language}/youtube_script_section.txt`;

  if (!summary) {
    res.status(400).json({
      message: "Summary is required.",
    });
    return; // Stop further execution
  }

  try {
    let gptScript = await newScriptPromptCompletion(inputFile, summary, style, point);
    console.log("🛸 ~ file: ai.js:155 ~ router.post ~ gptScript:", gptScript);
  
    res.status(200).json({
      message: "success",
      result: { script: gptScript },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred while generating the script.",
      result: error.message
    });
  }
});

router.post("/improve/script/:language", async (req, res, next) => {
  console.log("🚀 ~ file: ai.js:271 ~ router.post ~ req:", req.url, req.body)

  let language = req.params.language;
  let current = req.body.current;
  let prompt = req.body.prompt;

  if (!language || !['en', 'fr'].includes(language)) {
    res.status(400).json({
      message: "Invalid language. Language must be 'en' or 'fr'.",
    });
    return; // Stop further execution
  } 

  if (!current) {
    res.status(400).json({
      message: "Current is required.",
    });
    return; // Stop further execution
  }

  if (prompt === undefined || prompt === '') {
    res.status(400).json({
      message: "Prompt is required.",
    });
    return; // Stop further execution
  }

  let inputFile = getImproveFileName(language, prompt);
  if (inputFile === '') {
    res.status(400).json({
      message: "Something is missing in the request body.",
    });
    return; // Stop further execution
  }

  try {
    let gptScript = await improvePromptCompletion(inputFile, current);
    console.log("🚀 ~ file: ai.js:212 ~ router.post ~ gptScript:", gptScript);
  
    res.status(200).json({
      message: "success",
      result: { script: gptScript },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred while improving the script.",
      result: error.message
    });
  }
});

////////////////////
// TAGS ///////////
///////////////////

router.post("/new/tags/:language", async (req, res, next) => {
  console.log("🚀 ~ file: ai.js:242 ~ router.post ~ req:", req.url, req.body)

  let language = req.params.language;
  let summary = req.body.summary;
  let style = req.body.style;

  if (!language || !['en', 'fr'].includes(language)) {
    res.status(400).json({
      message: "Invalid language. Language must be 'en' or 'fr'.",
    });
    return; // Stop further execution
  } 
  inputFile = `backend/routes/inputprompts/${language}/youtube_tags.txt`;

  if (!summary) {
    res.status(400).json({
      message: "Summary is required.",
    });
    return; // Stop further execution
  }
  
  try {
    let gptTags = await newPromptCompletion(inputFile, summary, style);
    console.log("🚀 ~ file: ai.js:262 ~ router.post ~ gptTags:", gptTags);
  
    res.status(200).json({
      message: "success",
      result: { tags: gptTags },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred while generating new tags.",
      result: error.message
    });
  }
});

router.post("/improve/tags/:language", async (req, res, next) => {
  console.log("🚀 ~ file: ai.js:271 ~ router.post ~ req:", req.url, req.body)

  let language = req.params.language;
  let current = req.body.current;
  let prompt = req.body.prompt;

  if (!language || !['en', 'fr'].includes(language)) {
    res.status(400).json({
      message: "Invalid language. Language must be 'en' or 'fr'.",
    });
    return; // Stop further execution
  } 

  if (current === "") {
    res.status(500).json({
      message: "current is required",
    });
    return;
  }

  let inputFile = getImproveFileName(language, prompt);
  if (inputFile === '') {
    res.status(400).json({
      message: "Something is missing in the request body.",
    });
    return; // Stop further execution
  }

  try {
    let gptTags = await improvePromptCompletion(inputFile, current);
    console.log("🚀 ~ file: ai.js:212 ~ router.post ~ gptTags:", gptTags)
  
    res.status(200).json({
      message: "success",
      result: { tags: gptTags },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred while improving tags.",
      result: error.message
    });
  }
});

////////////////////
// FUNCTIONS //////
////////////////////

function getImproveFileName(language, prompt) {
  inputFolder = `backend/routes/inputprompts/${language}`

  switch (prompt) { 
    case 'funnier': return `${inputFolder}/optimizer_funnier.txt`;
    case 'formal': return `${inputFolder}/optimizer_formal.txt`;
    case 'simpler': return `${inputFolder}/optimizer_simpler.txt`;
    case 'expand': return `${inputFolder}/optimizer_expand.txt`;
    case 'shorten': return `${inputFolder}/optimizer_shorten.txt`;
    default: {
      console.log('🔥 Invalid prompt:', prompt);
      return ''
    }
  }
}

async function getNewOutputCompletion(prompt, maxRetries = 3) {
  let retryCount = 0; //implement retry mechanism
  let innerError = '';

  if (!prompt) {
    throw new Error("Prompt is required.");
  }

  while (retryCount < maxRetries) {
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
        console.log("API Error:", error.response.status + ", " + error.response.data);
        innerError = error.response.data;
      } else {
        console.log("Request Error:", error.message);
        innerError = error.message;
      }
    }
    retryCount++;
  }
  throw new Error("Max retries exceeded for error:", innerError);
}

async function getOptimizedOutputCompletion(prompt) {
  let retryCount = 0; //implement retry mechanism
  let innerError = '';

  if (!prompt) {
    throw new Error("Prompt is required.");
  }

  while (retryCount < maxRetries) {
    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 1,
        max_tokens: 2500,
        top_p: 1,
        presence_penalty: 0.6,
        frequency_penalty: 0.6
      });
      return completion.data.choices[0].text;
      
    } catch (error) {
      if (error.response) {
        console.log("API Error:", error.response.status + ", " + error.response.data);
        innerError = error.response.data;
      } else {
        console.log("Request Error:", error.message);
        innerError = error.message;
      }
    }
    retryCount++;
  }
  throw new Error("Max retries exceeded for error:", innerError);
}

function summaryPromptCompletion(inputFile, inputParam) {
  if (!inputFile) {
    throw new Error("Invalid input file.");
  }

  if (!inputParam) {
    throw new Error("Invalid input parameter.");
  }

  rawPrompt = readTextFileToPrompt(inputFile);
  summaryPrompt = rawPrompt.replace("<<FEED>>", inputParam);

  return getNewOutputCompletion(summaryPrompt);
}

function newScriptPromptCompletion(inputFile, inputParam, styleParam, durationPoint) {
  if (!inputFile || !inputParam || !styleParam || !durationPoint) {
    throw new Error("Invalid input parameters. Please provide all required parameters.");
  }

  rawPrompt = readTextFileToPrompt(inputFile); 
  scriptPrompt = rawPrompt
    .replace("<<FEED>>", inputParam)
    .replace("<<STYLE>>", styleParam)
    .replace("<<POINT>>", durationPoint);

  return getNewOutputCompletion(scriptPrompt);
}

function newPromptCompletion(filename, inputParam, styleParam) {
  if (!filename || !inputParam || !styleParam) {
    throw new Error("Invalid input parameters. Please provide all required parameters.");
  }

  rawPrompt = readTextFileToPrompt(filename);
  if (inputParam === '') {
    console.log("🔥 ~ file: ai.js:80 ~ newPromptCompletion ~", filename, inputParam, styleParam)
    return
  }
  properPrompt = rawPrompt.replace("<<FEED>>", inputParam).replace("<<STYLE>>", styleParam);
  return getNewOutputCompletion(properPrompt);
}

function improvePromptCompletion(filename, inputParam) {
  if (!filename || !inputParam) {
    throw new Error("Invalid input parameters. Please provide all required parameters.");
  }

  if (inputParam === '') {
    throw new Error("Invalid input parameter. Please provide a valid input parameter.");
  }

  rawPrompt = readTextFileToPrompt(filename);
  properPrompt = rawPrompt.replace("SOURCE", inputParam);
  return getOptimizedOutputCompletion(properPrompt);
}

function readTextFileToPrompt(filename) {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    return data;
  } catch (err) {
    throw new Error(`Error reading file: ${filename}. Error message: ${err.message}`);
  }
}


module.exports = router;
