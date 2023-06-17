const express = require("express");
const axios = require("axios");
const { pipeline } = require("stream");
const { ELEVEN_LABS_API_KEY } = require("../appsecrets");

const router = express.Router();

const ELEVEN_BASE_URL = "https://api.elevenlabs.io";
const MONOLINGUAL_MODEL = "eleven_monolingual_v1";
const MULTILINGUAL_MODEL = "eleven_multilingual_v1";

router.get("", async (req, res) => {
  try {
    const response = await axios.get(`${ELEVEN_BASE_URL}/v1/voices`, {
      headers: {
        accept: "application/json",
        "xi-api-key": ELEVEN_LABS_API_KEY,
      },
    });

    if ("voices" in response.data) {
      const mappedVoices = response.data.voices.map((voice) => ({
        id: voice.voice_id,
        name: voice.name,
      }));
      res.status(200).json({
        message: "success",
        result: mappedVoices,
      });
    } else {
      res.status(422).json({
        message: "validation error",
        result: response.data,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "something went wrong in voices",
      result: error.message,
    });
  }
});

router.post("", async (req, res) => {
  const voiceId = req.body.voiceId;
  const language = req.body.language;
  const videoText = req.body.text;
  if (language !== "en" && language !== "fr") {
    res.status(422).json({
      message: "Language not supported.",
    });
    return; // Stop further execution
  }

  if (language === "en") {
    modelId = MONOLINGUAL_MODEL;
  } else if (language === "fr") {
    modelId = MULTILINGUAL_MODEL;
  } else {
    res.status(422).json({
      message: "language not supported",
    });
    return;
  }

  const reqBody = {
    text: videoText,
    model_id: modelId,
  };
  const url = `${ELEVEN_BASE_URL}/v1/text-to-speech/${voiceId}/stream`;
  fetch(url, {
    headers: {
      Accept: "audio/mpeg",
      "xi-api-key": ELEVEN_LABS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
    method: "POST",
  })
    .then((response) => {
      handleResponse(response, async (streamResponse) => {
        res.set({
          "Content-Type": "audio/mpeg",
        });
        const stream = await streamResponse.body;
        pipeline(stream, res, (err) => {
          if (err) {
            console.error("🔥 Pipeline failed.", err);
            throw new Error(err.message);
          } else {
            console.log("Pipeline succeeded.");
          }
        });
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "pipeline failed",
        result: err,
      });
    });
});

/**
 * Just a nifty wrapper for error handling
 * @param {Response} fetchResponse
 * @param {Function | Promise<any>} callback
 * @returns Promise<any>
 */
async function handleResponse(fetchResponse, callback, errorCallback) {
  try {
    if (!fetchResponse) {
      throw new Error("🔥 Fetch response is required.");
    }
    if (typeof callback !== "function" && !(callback instanceof Promise)) {
      throw new Error("🔥 Callback must be a function or a promise.");
    }
    if (typeof errorCallback !== "function") {
      throw new Error("🔥 Error callback must be a function.");
    }

    if (fetchResponse.ok) {
      return callback(fetchResponse);
    } else if (fetchResponse.status === 400) {
      errorCallback(400, fetchResponse.json());
    } else if (fetchResponse.status === 403) {
      errorCallback(403, fetchResponse.json());
    } else {
      errorCallback(500, fetchResponse.json());
    }
  } catch (error) {
    console.error("🔥 Error:", error.message);
    errorCallback(500, fetchResponse.json());
  }
}

module.exports = router;
