const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const playhtUserId = "Y0Yo31zn6ofKRyhNFyNj1gSxEJ63";
const playhtSecret = "5992824d1a1b4779a76e4176ca0d1d07";

// const elevenLabsApiKey = 'f0efaf9cb08bce89d11a04e70fc677f6'

router.get("/voices", async (req, res) => {
  const url = "https://play.ht/api/v1/getVoices";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      AUTHORIZATION: `Bearer ${playhtSecret}`,
      "X-USER-ID": playhtUserId,
    },
  };

  await fetch(url, options)
    .then((response) => response.json())
    .then((responseObj) => {
      const jsonVoicesArr = responseObj.voices;
      const frenchVoicesArr = jsonVoicesArr.filter(voice => voice.languageCode === 'fr-FR');
      return res.status(200).json(frenchVoicesArr);
    })
    .catch((error) => {
      console.log("🔥 ~ file: voice.js:24 ~ router.get ~ error:", error);
      return res.status(403).json(error.message);
    });
});

router.post("/generate", async (req, res) => {
  let reqContent = req.body.content.split('\n');
  let reqVoice = req.body.voice;
  const updateBody = {
    content: reqContent,
    voice: reqVoice,
  }
  console.log("🚀 ~ file: voice.js:34 ~ router.post ~ body:", updateBody)
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      AUTHORIZATION: "Bearer 5992824d1a1b4779a76e4176ca0d1d07",
      "X-USER-ID": "Y0Yo31zn6ofKRyhNFyNj1gSxEJ63",
    },
    body: JSON.stringify(updateBody)
  };

  const response = await fetch("https://play.ht/api/v1/convert", options);

  handleResponse(response, async (jsonResponse) => {
    console.log("🚀 ~ file: voice.js:48 ~ handleResponse ~ jsonResponse:", jsonResponse)
    if (jsonResponse['status'] === 'CREATED') {
      //We have successfully kicked off our job. Now we need to poll the status of the job
      await pollForStatus(res, jsonResponse['transcriptionId']).catch((error) => {
        console.log("🔥 ~ file: voice.js:52 ~ router.post ~ error:", error);
        return res.status(403).json(error.message);
      });
    }
  });
});

/**
   * @param {Response<any, Record<string, any>, number>} res
   * @param {string} transcriptionId 
   * @returns string: AudioUrl
   */
async function pollForStatus(res, transcriptionId) {
  const url = `https://play.ht/api/v1/articleStatus?transcriptionId=${transcriptionId}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      AUTHORIZATION: "Bearer 5992824d1a1b4779a76e4176ca0d1d07",
      "X-USER-ID": "Y0Yo31zn6ofKRyhNFyNj1gSxEJ63",
    },
  };
  return handleResponse(await fetch(url, options), async (jsonResponse) => {
    console.log("🚀 ~ file: voice.js:77 ~ returnhandleResponse ~ jsonResponse:", jsonResponse)
    articleStatusConverted = jsonResponse['converted'];
    articleStatusError = jsonResponse['error'];

    if (articleStatusConverted === true) {
      res.status(200).json({
        message: "Successfully generated audio",
        error: false,
        audioUrl: jsonResponse['audioUrl']
      });

    } else if (articleStatusError === true) {
      console.log("🔥 ~ file: voice.js:85 ~ returnhandleResponse ~ articleStatusError:", articleStatusError)
      res.status(400).json({
        message: "Error generating audio",
        error: true,
        audioUrl: audioUrl
      });
    } else {
      setTimeout(() => {
        pollForStatus(res, transcriptionId)
      }, 5000);
    }
  });
}

/**
   * Just a nifty wrapper for error handling
   * @param {Response} fetchResponse 
   * @param {Function | Promise<any>} callback 
   * @returns Promise<any>
   */
async function handleResponse(fetchResponse, callback) {
  try {
    if (fetchResponse.ok) {
      const jsonResponse = await fetchResponse.json();
      return callback(jsonResponse);

    } else if (fetchResponse.status === 400) {
      console.log("🔥 ~ file: voice.js:133 ~ handleResponse ~ fetchResponse:", fetchResponse)
      res.status(400).json(jsonResponse);

    } else if (fetchResponse.status === 403) {
      console.log("🔥 ~ file: voice.js:138 ~ handleResponse ~ fetchResponse:", fetchResponse)
      res.status(403).send(jsonResponse);

    } else {
      console.log("🔥 ~ file: voice.js:143 ~ handleResponse ~ fetchResponse:", fetchResponse)
      res.status(500).send(jsonResponse);
    }
  } catch (error) {
    console.error("🔥 Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = router;
