const express = require('express');
const app = express();
const { getTopics, getEndpoints } = require("./controllers/topics.controller.js");
const { getArticleById, getArticles} = require("./controllers/articles.controller.js");
const { getCommentsById } = require("./controllers/comments.controller.js");

app.get('/api', getEndpoints)

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsById)

app.all('/*', (req, res, next) => {
    res.status(404).send({msg: 'path not found'})
})

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({msg: "invalid request"})
    } else if (err.status) {
        res.status(err.status).send(err)
    }
});

module.exports = app;