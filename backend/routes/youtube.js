const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const { YOUTUBE_DATA_V3_KEY } = require("../../appsecrets");

const BASE_URL = "https://www.googleapis.com/youtube/v3";
const SEARCH_URL = `${BASE_URL}/search`;

router.post("/auth", async (req, res, next) => {
  let body = req.body;

  res.status(200).json({
    message: "success",
    result: { topic: "How to make money using faceless youtube channels." },
  });
});

router.get("/videos", async (req, res) => {
  const reqNiche = req.body.niche;
  const reqPublishedAtfter = req.body.publishedAfter;

  if (reqNiche === undefined || reqNiche === null || reqNiche === "") {
    res.status(400).json({ error: "Missing niche parameter" });
  }

  try {
    const params = {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };

    const queryParams = new URLSearchParams({
      part: "snippet",
      maxResults: "25",
      order: "viewCount",
      publishedAfter: "2023-04-25T00:00:00Z",
      q: reqNiche,
      regionCode: "US",
      relevanceLanguage: "en",
      type: "video",
      videoDuration: "medium",
      videoEmbeddable: true,
      key: YOUTUBE_DATA_V3_KEY,
    });

    const apiUrl = `${SEARCH_URL}?${queryParams.toString()}`;

    await fetch(apiUrl, params)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Error fetching videos');
        }
      }).pipe(
        map((data) => {
          return data.items.map((item) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.medium.url,
            publishedAt: item.snippet.publishedAt,
          }));
         })
      ).then(data => {
        // Map the data object here
        res.status(200).json(mappedData);
      }).catch(err => {
        console.error(err);
        // Handle errors here
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
