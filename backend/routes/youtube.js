const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const { map, mergeMap } = require("rxjs/operators");
const { from, forkJoin } = require("rxjs");
const { YOUTUBE_DATA_V3_KEY } = require("../../appsecrets");

const BASE_URL = "https://www.googleapis.com/youtube/v3";
const SEARCH_URL = `${BASE_URL}/search`;
const VIDEO_URL = `${BASE_URL}/videos`;

router.get("/videos", async (req, res) => {
  const reqNiche = req.query.niche;
  const reqPublishedAtfter = req.query.publishedAfter;

  if (reqNiche === undefined || reqNiche === null || reqNiche === "") {
    res.status(400).json({ error: "Missing niche parameter" });
  }

  try {
    fetchCompleteVideoData(reqNiche, reqPublishedAtfter).subscribe(
      (data) => {
        console.log("🚀 ~ file: youtube.js:23 ~ router.get ~ data:", data)
        res.status(200).json(data);
      },
      (err) => {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
/**
 * Gets our list of videos from the YouTube API and checks for errors
 * @param {string} apiUrl 
 * @param {URLSearchParams} params 
 * @returns 
 */
function fetchVideoList(niche, publishedAfter) {
  const params = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  const queryParams = new URLSearchParams({
    part: "snippet",
    maxResults: "12",
    order: "viewCount",
    publishedAfter: publishedAfter,
    q: niche,
    regionCode: "US",
    relevanceLanguage: "en",
    type: "video",
    videoDuration: "medium",
    videoEmbeddable: true,
    key: YOUTUBE_DATA_V3_KEY,
  });

  const apiUrl = `${SEARCH_URL}?${queryParams.toString()}`;
  return from(fetch(apiUrl, params)).pipe(
    mergeMap((res) => {
      if (res.ok) {
        return from(res.json());
      } else {
        console.log('Error fetching videos');
      }
    })
  );
}

/**
 * Fetch data from youtube API and update our list
 * @param {*} id 
 * @param {*} params 
 * @returns Observable<>
 */
function fetchVideoDetails(videoId) {
  const params = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  const queryParams = new URLSearchParams({
    part: "statistics",
    maxResults: "1",
    id: videoId,
    key: YOUTUBE_DATA_V3_KEY,
  });

  const apiUrl = `${VIDEO_URL}?${queryParams.toString()}`;
  return from(
    fetch(apiUrl, params)
  ).pipe(
    mergeMap((res) => {
      console.log("🚀 ~ file: youtube.js:114 ~ mergeMap ~ res:", res)
      if (res.ok) {
        return from(res.json());
      } else {
        console.log(`Error updating video ${id}`);
      }
    })
  );
}

/**
 * Function that updates the video data for all the items in the input list
 * @param {Array} videoList
 */ 
function mapVideoListToDetails(videoList) {
  console.log("🚀 ~ file: youtube.js:128 ~ updateVideoList ~ videoList:", videoList)
  const updateObservables = videoList.map((video) =>
    fetchVideoDetails(video.id).pipe(
      map((data) => {
        console.log("🚀 ~ file: youtube.js:131 ~ map ~ data:", data)
        const videoDetails = data.items[0].statistics;
        return {
          ...video,
          statistics: {
            viewCount: videoDetails.viewCount,
            likeCount: videoDetails.likeCount,
            commentCount: videoDetails.commentCount,
          },
        };
      })
  ));

  return forkJoin(updateObservables);
}

/**
 * Complete wrapper for our fetch functions
 * @returns 
 */
function fetchCompleteVideoData(niche, publishedAfter) {
  return fetchVideoList(niche, publishedAfter)
    .pipe(
      map((data) =>
        data.items.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnailUrl: item.snippet.thumbnails.high.url,
          publishedAt: item.snippet.publishTime,
          channelTitle: item.snippet.channelTitle,
        }))
      ),
      mergeMap((videoList) => mapVideoListToDetails(videoList))
    )
}

module.exports = router;
