const express = require('express');
const axios = require('axios');
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
  const voiceId = req.params.id;
  const language = req.params.language
  if (language === 'en') {
    modelId =  "eleven_monolingual_v1"
  } else if (language === 'fr') {
    modelId =  "eleven_multilingual_v1"
  } else {
    res.status(422).json({
      "message": "language not supported"
    })
  }

  const reqBody = {
    text: 'set string',
    model_id: modelId
  }

  try {
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
      if (response.ok) {
        console.log("🚀 ~ file: elevenlabs.js:75 ~ router.post ~ jsonResponse:", response)

        // handle the successful response here
        // the response body will be a stream of audio/mpeg data
      } else {
        console.log("🔥 ~ file: elevenlabs.js:77 ~ router.post ~ response:", response.data)

        // handle the error response here
      }
    })
    .catch(error => {
      // handle any errors that occurred during the request here
      console.log("🚀 ~ file: elevenlabs.js:102 ~ router.post ~ o:", error)
    });

    // if (response.ok) {
    //   const jsonResponse = await response.json();
    //   console.log("🚀 ~ file: elevenlabs.js:75 ~ router.post ~ jsonResponse:", jsonResponse)
    // } else {
    //   console.log("🔥 ~ file: elevenlabs.js:77 ~ router.post ~ response:", response.data)
    // }
    // // Return the audio stream to the client
    // res.status(200).contentType('audio/mpeg');
    // response.data.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      "message": error.message,
    });
  }
});


module.exports = router;
