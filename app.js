const express = require('express');
const app = express();
const { getTopics } = require("./controllers/topics.controller.js");

app.get('/api/topics', getTopics);

app.all('/*', (req, res, next) => {
    res.status(404).send({msg: 'path not found'})
})

module.exports = app;