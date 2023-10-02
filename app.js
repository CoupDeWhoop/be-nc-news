const express = require('express');
const app = express();
const { getTopics, getEndpoints } = require("./controllers/topics.controller.js");

app.get('/api', getEndpoints)

app.get('/api/topics', getTopics);



app.all('/*', (req, res, next) => {
    res.status(404).send({msg: 'path not found'})
})

module.exports = app;