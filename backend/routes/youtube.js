const express = require("express");
const router = express.Router();

router.post("/auth", async (req, res, next) => {
  let body = req.body
  console.log("🚀 ~ file: youtube.js:6 ~ router.post ~ body:", body)
  
  res.status(200).json({
    message: "success",
    result: { topic: "How to make money using faceless youtube channels." },
  });
});