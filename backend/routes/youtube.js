const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const axios = require("axios");
const { map, mergeMap, concatMap, filter } = require("rxjs/operators");
const { from, forkJoin, of } = require("rxjs");
const { YOUTUBE_DATA_V3_KEY } = require("../../appsecrets");

const BASE_URL = "https://www.googleapis.com/youtube/v3";
const SEARCH_URL = `${BASE_URL}/search`;
const VIDEO_URL = `${BASE_URL}/videos`;

const TranslationService = require("../service/translation.service");
const translationService = new TranslationService();

const englishRegex = /^[a-zA-Z\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

router.get("/videos/:language", async (req, res) => {
  const language = req.params.language;
  //language check here
  const reqNiche = req.query.niche;
  const reqPublishedAtfter = req.query.publishedAfter;

  if (reqNiche === undefined || reqNiche === null || reqNiche === "") {
    res.status(400).json({ error: "Missing niche parameter" });
    return;
  }

  try {
    fetchCompleteVideoData(language, reqNiche, reqPublishedAtfter).subscribe(
      (data) => {
        of(data).subscribe({
            next: (results) => {
              console.log("🚀 ~ file: youtube.js:23 ~ router.get ~ data:", results)
              res.status(200).json(results);
            },
            error: (err) => {
              console.log("🔥 ~ file: youtube.js:35 ~ of ~ err:", err)
              console.error(err);
              res.status(500).json(err);
            }
          })
      })
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


/**
 * Complete wrapper for our fetch functions
 * @returns 
 */
function fetchCompleteVideoData(language, niche, publishedAfter) {
  if (!language || !niche || !publishedAfter) {
    throw new Error("Invalid input parameters.");
  }

  return fetchVideoList(niche, publishedAfter).pipe(
    map((data) => {
      return data.items
        .filter((item) => englishRegex.test(item.snippet.title ))
        .map(async (item) => {

        let processedTitle = item.snippet.title;
        let processedDescription = item.snippet.description;
  
        if (language === 'fr') {
          if (processedTitle !== undefined && processedTitle !== null && processedTitle !== "") {
            processedTitle = await translationService.translateText(processedTitle);
          }
          if (processedDescription !== undefined && processedDescription !== null && processedDescription !== "") {
            processedDescription = await translationService.translateText(processedDescription);
          }
          return {
            id: item.id.videoId,
            title: processedTitle,
            description: processedDescription,
            thumbnailUrl: item.snippet.thumbnails.high.url,
            publishedAt: item.snippet.publishTime,
            channelTitle: item.snippet.channelTitle,
          }
        } else {
          return {
            id: item.id.videoId,
            title: processedTitle,
            description: processedDescription,
            thumbnailUrl: item.snippet.thumbnails.high.url,
            publishedAt: item.snippet.publishTime,
            channelTitle: item.snippet.channelTitle,
          };
        }
      });
    }),
    concatMap((observables) => forkJoin(observables)),
    // mergeMap((videoList) => mapVideoListToDetails(videoList))
  );
}


/**
 * Gets our list of videos from the YouTube API and checks for errors
 * @param {string} apiUrl 
 * @param {URLSearchParams} params 
 * @returns 
 */
function fetchVideoList(niche, publishedAfter) {
  if (!niche || !publishedAfter) {
    throw new Error("Invalid input parameters.");
  }

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
      } else if (res.status === 403) {
        throw new Error("YouTube Data API quota exceeded. Please try again later.");
        //create unique error for quota exceeded that will logged by Crashylitics
      } else {
        throw new Error("Failed to fetch video list from the YouTube Data API.");
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
  if (!videoId) {
    throw new Error("Invalid input parameters.");
  }

  const params = {
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
  return from(axios.get(apiUrl, {
      params: queryParams,
      ...params
    })).pipe(
      mergeMap((response) => {
        try {
          return from(response.data);
        } catch (err) {
          console.log("🔥 ~ file: youtube.js:115 ~ mergeMap ~ err:", err)
          return of(null);
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

module.exports = router;
