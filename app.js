const express = require('express');
const app = express();
const { getTopics, getEndpoints } = require("./controllers/topics.controller.js");
const { getArticleById } = require("./controllers/articles.controller.js");

app.get('/api', getEndpoints)

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById)



app.all('/*', (req, res, next) => {
    res.status(404).send({msg: 'path not found'})
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status).send(err)

});

module.exports = app;