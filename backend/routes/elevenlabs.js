const express = require('express');
const axios = require('axios');
const { pipeline } = require('stream');
const { ELEVEN_LABS_API_KEY } = require("../../appsecrets");

const router = express.Router();

const ELEVEN_BASE_URL = 'https://api.elevenlabs.io'

router.get('', async (req, res) => {
  try {
    const response = await axios.get(`${ELEVEN_BASE_URL}/v1/voices`, {
      headers: {
        'accept': 'application/json',
        'xi-api-key': ELEVEN_LABS_API_KEY,
      },
    });

    if ("voices" in response.data) {
      const mappedVoices = response.data.voices.map(voice => {
        return {
          id: voice.voice_id,
          name: voice.name
        };
      });
      res.status(200).json({
        "message": "success",
        "result": mappedVoices
      });
    } else {
      res.status(422).json({
        "message": "validation error",
        "result": response.data
      })
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      "result": error.message,
    });
  }
});

router.post('/:id/:language', async (req, res) => {
  console.log("🚀 ~ file: elevenlabs.js:45 ~ router.post ~ req:", req.body)
  const voiceId = req.params.id;
  const language = req.params.language
  if (language === 'en') {
    modelId = "eleven_monolingual_v1"
  } else if (language === 'fr') {
    modelId = "eleven_multilingual_v1"
  } else {
    res.status(422).json({
      "message": "language not supported"
    })
  }

  const reqBody = {
    text: req.body.text,
    model_id: modelId
  }
  console.log("🚀 ~ file: elevenlabs.js:61 ~ router.post ~ reqBody:", reqBody)

  const url = `${ELEVEN_BASE_URL}/v1/text-to-speech/${voiceId}`;
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
      res.set({
        'Content-Type': 'audio/mpeg'
      })
      const stream = await streamResponse.body
      await pipeline(stream, res, (err) => {
        if (err) {
          console.error('Pipeline failed.', err);
          res.status(500).json({
            "message": "pipeline failed",
            "result": err
          })
        } else {
          console.log('Pipeline succeeded.');
        }
      })
      // streamResponse.body.pipe(res)
    }, (errorStatus, response) => {
      res.status(errorStatus).json(response)
    })
  }).catch(error => {
    // handle any errors that occurred during the request here
    console.log("🚀 ~ file: elevenlabs.js:102 ~ router.post ~ o:", error)
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
