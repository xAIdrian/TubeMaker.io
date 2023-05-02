const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
var cors = require('cors')

const app = express();
const openaiRoutes = require('./routes/ai')
const playhtRoutes = require('./routes/playht')
const voiceRoutes = require('./routes/elevenlabs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join('backend', 'images')));

/**
 * Where you can manipulate the reqeusts that is going through before it reaches the endpoints
 * 'use' means all requests will go through this middleware
 * CORS
 */
app.use(cors())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        'Access-Control-Allow-Headers', 
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        'Access-Control-Allow-Methods', 
        'GET, POST, PATCH, DELETE, OPTIONS, PUT' //OPTIONS is for the browser to check if the request is allowed
    )
    next();
});

app.use("/api/openai", openaiRoutes)
app.use("/api/playht", playhtRoutes)
app.use("/api/voices", voiceRoutes)

module.exports = app;
