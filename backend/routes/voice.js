const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

const playhtUserId = "Y0Yo31zn6ofKRyhNFyNj1gSxEJ63";
const playhtSecret = "5992824d1a1b4779a76e4176ca0d1d07";

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
    .then((response) => {
      JSON.parse(response.json());
    })
    .then((responseObj) => {
      console.log("🚀 ~ file: voice.js:23 ~ .then ~ responseObj:", responseObj);
      const jsonVoices = responseObj.voices;
      jsonVoices.filter((voice) => voice.languageCode === "fr-FR");
    })
    .then((filteredVoices) => {
      console.log(
        "🚀 ~ file: voice.js:29 ~ .then ~ filteredVoices:",
        filteredVoices
      );
      return res.status(200).json(filteredVoices);
    })
    .catch((error) => {
      console.log("🚀 ~ file: voice.js:24 ~ router.get ~ error:", error);
      return res.status(403).json(error.message);
    });
});

router.post("/convert", async (req, res) => {
  const { content, voice, title, narrationStyle } = req.body;

  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      AUTHORIZATION: "Bearer 5992824d1a1b4779a76e4176ca0d1d07",
      "X-USER-ID": "Y0Yo31zn6ofKRyhNFyNj1gSxEJ63",
    },
    body: JSON.stringify({ content, voice, title, narrationStyle }),
  };

  try {
    const response = await fetch("https://play.ht/api/v1/convert", options);
    const jsonResponse = await response.json();

    if (response.ok) {
      res.status(201).json(jsonResponse);
    } else if (response.status === 400) {
      res.status(400).json(jsonResponse);
    } else if (response.status === 403) {
      res.status(403).send(jsonResponse);
    } else {
      throw new Error("Unexpected response from API");
    }
  } catch (error) {
    console.log("🚀 ~ file: media.js:63 ~ router.post ~ error:", error);
    res.status(500).send("Internal server error");
  }
});

router.get("/article-status", async (req, res) => {
  const transcriptionId = req.query.transcriptionId;

  const url = `https://play.ht/api/v1/articleStatus?transcriptionId=${transcriptionId}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      AUTHORIZATION: "Bearer 5992824d1a1b4779a76e4176ca0d1d07",
      "X-USER-ID": "Y0Yo31zn6ofKRyhNFyNj1gSxEJ63",
    },
  };

  try {
    const response = await fetch(url, options);

    if (response.status === 403) {
      throw new Error("Forbidden");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
