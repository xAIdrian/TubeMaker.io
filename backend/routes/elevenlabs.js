const express = require('express');
const axios = require('axios');
const { pipeline } = require('stream');
const { ELEVEN_LABS_API_KEY } = require("../../appsecrets");

const router = express.Router();

const ELEVEN_BASE_URL = 'https://api.elevenlabs.io'
const MONOLINGUAL_MODEL = 'eleven_monolingual_v1'
const MULTILINGUAL_MODEL = 'eleven_multilingual_v1'

router.get('', async (req, res) => {
  try {
    const response = await axios.get(`${ELEVEN_BASE_URL}/v1/voices`, {
      headers: {
        'accept': 'application/json',
        'xi-api-key': ELEVEN_LABS_API_KEY,
      },
    });

    if ("voices" in response.data) {
      const mappedVoices = response.data.voices.map((voice) => ({
        id: voice.voice_id,
        name: voice.name,
      }));
      res.status(200).json({
        message: "success",
        result: mappedVoices
      });
    } else {
      res.status(422).json({
        message: "validation error",
        result: response.data
      })
    }
  } catch (error) {
    console.log("🔥 ~ file: elevenlabs.js:37 ~ router.get ~ error:", error)
    
    res.status(500).send({
      message: 'something went wrong in voices',
      result: error.message,
    });
  }
});

router.post('', async (req, res) => {
  const voiceId = req.body.voiceId;
  console.log("🚀 ~ file: elevenlabs.js:48 ~ router.post ~ voiceId:", voiceId)
  const language = req.body.language
  console.log("🚀 ~ file: elevenlabs.js:50 ~ router.post ~ language:", language)
  const videoText = req.body.text; 
  console.log("🚀 ~ file: elevenlabs.js:52 ~ router.post ~ videoText:", videoText)

  if (language !== 'en' && language !== 'fr') {
    console.log("🔥 ~ file: elevenlabs.js:52 ~ router.post ~ language:", language)
    res.status(422).json({
      message: "Language not supported.",
    });
    return; // Stop further execution
  }

  if (language === 'en') {
    modelId = MONOLINGUAL_MODEL;
  } else if (language === 'fr') {
    modelId = MULTILINGUAL_MODEL;
  } else {
    console.log("🔥 ~ file: elevenlabs.js:63 ~ router.post ~ else:", 'language not supported')
    res.status(422).json({
      message: "language not supported"
    })
    return;
  }

  const reqBody = {
    'text': videoText,
    'model_id': modelId
  }
  console.log("🚀 ~ file: elevenlabs.js:61 ~ router.post ~ reqBody:", reqBody)

  const url = `${ELEVEN_BASE_URL}/v1/text-to-speech/${voiceId}/stream`;
  fetch(url, {
    headers: {
      'Accept': 'audio/mpeg',
      'xi-api-key': ELEVEN_LABS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqBody),
    method: 'POST',
  }).then(response => {
    handleResponse(response, async (streamResponse) => {
      console.log("🚀 ~ GOOD file: elevenlabs.js:91 ~ handleResponse ~ response:", response)
      res.set({
        'Content-Type': 'audio/mpeg'
      })
      const stream = await streamResponse.body
      pipeline(stream, res, (err) => {
        if (err) {
          console.error('🔥 Pipeline failed.', err);
          res.status(500).json({
            "message": "pipeline failed",
            "result": err
          });
        } else {
          console.log('Pipeline succeeded.');
        }
      })
    },
    (errorStatus, response) => {
      console.log("🔥 ~ file: elevenlabs.js:111 ~ router.post ~ errorStatus, response:", errorStatus)
      response.then((data) => {
        console.log("🔥 ~ file: elevenlabs.js:113 ~ response.then ~ data:", data)
      }).catch((err) => {
        console.log("🔥 ~ file: elevenlabs.js:115 ~ response.then ~ err:", err)
      })
      res.status(errorStatus).json(response)
    })
  }).catch(error => {
    console.log("🔥 ~ file: elevenlabs.js:102 ~ router.post ~ o:", error)
    res.status(500).json({
      "message": "pipeline failed",
      "result": err
    })
  });
});

/**
   * Just a nifty wrapper for error handling
   * @param {Response} fetchResponse 
   * @param {Function | Promise<any>} callback 
   * @returns Promise<any>
   */
async function handleResponse(
  fetchResponse,
  callback,
  errorCallback
) {
  try {
    if (!fetchResponse) {
      console.log("🔥 ~ file: elevenlabs.js:142 ~ fetchResponse:", fetchResponse)
      throw new Error("🔥 Fetch response is required.");
    }
    if (typeof callback !== "function" && !(callback instanceof Promise)) {
      throw new Error("🔥 Callback must be a function or a promise.");
    }
    if (typeof errorCallback !== "function") {
      console.log("🔥 ~ file: elevenlabs.js:149 ~ errorCallback:", errorCallback)
      throw new Error("🔥 Error callback must be a function.");
    }
    
    if (fetchResponse.ok) {
      return callback(fetchResponse);

    } else if (fetchResponse.status === 400) {
      console.log("🔥 ~ file: voice.js:133 ~ handleResponse ~ fetchResponse:", fetchResponse)
      errorCallback(400, fetchResponse.json())
    } else if (fetchResponse.status === 403) {
      console.log("🔥 ~ file: voice.js:138 ~ handleResponse ~ fetchResponse:", fetchResponse)
      errorCallback(403, fetchResponse.json())
    } else {
      console.log("🔥 ~ file: voice.js:143 ~ handleResponse ~ fetchResponse:", fetchResponse)
      errorCallback(500, fetchResponse.json())
    }
  } catch (error) {
    console.error("🔥 Error:", error.message);
    errorCallback(500, fetchResponse.json())
  }
}

module.exports = router;
