const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const { map } = require("rxjs/operators");
const { YOUTUBE_DATA_V3_KEY } = require("../../appsecrets");

const BASE_URL = "https://www.googleapis.com/youtube/v3";
const SEARCH_URL = `${BASE_URL}/search`;

router.get("/videos", async (req, res) => {
  const reqNiche = req.query.niche;
  const reqPublishedAtfter = req.query.publishedAfter;

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
      publishedAfter: reqPublishedAtfter,
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
      .then((res) => {
        console.log("🚀 ~ file: youtube.js:45 ~ .then ~ res:", res)
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Error fetching videos");
        }
      })
      .then((data) => {
        return data.items.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high.url,
          publishedAt: item.snippet.publishTime,
          channelTitle: item.channelTitle,
          // viewCount: item.statistics.viewCount,
          // likeCount: item.statistics.likeCount,
          // dislikeCount: item.statistics.dislikeCount,
          // commentCount: item.statistics.commentCount,
        }));
      })
      .then((data) => {
        // Map the data object here
        res.status(200).json(data);
      })
      .catch((err) => {
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
