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
    console.log("🚀 ~ file: elevenlabs.js:13 ~ router.get ~ response:", response)

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
    "text": req.body.text,
    "model_id": modelId
  }

  try {
    const url = `${ELEVEN_BASE_URL}/v1/text-to-speech/${voiceId}/stream`;
    const response = await axios.post(url, {
      headers: {
        'accept': 'application/json',
        'xi-api-key': ELEVEN_LABS_API_KEY,
      },
      data: reqBody,
      method: 'post',
      responseType: 'stream',
    });
    // Return the audio stream to the client
    res.status(200).contentType('audio/mpeg');
    response.data.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      "message": error.message,
    });
  }
});


module.exports = router;
