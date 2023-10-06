const express = require('express');
const app = express();
const { getTopics, getEndpoints } = require("./controllers/topics.controller.js");
const { getArticleById, getArticles, patchVotesByArticleId} = require("./controllers/articles.controller.js");
const { getCommentsById, postComment, deleteCommentByCommentId } = require("./controllers/comments.controller.js");
const { getUsers } = require("./controllers/users.controller.js")

app.use(express.json());

app.get('/api', getEndpoints)

app.get('/api/topics', getTopics);

app.get('/api/users', getUsers)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsById)

app.post('/api/articles/:article_id/comments', postComment)

app.patch('/api/articles/:article_id', patchVotesByArticleId)

app.delete('/api/comments/:comment_id', deleteCommentByCommentId)

app.all('/*', (req, res, next) => {
    res.status(404).send({msg: 'path not found'})
})

app.use((err, req, res, next) => {
    if (err.code === "22P02" || err.code === "23502") {
        res.status(400).send({msg: "invalid request"})
    } else if (err.code === "23503") {
        res.status(404).send({msg: "provided key not found"})
    } else if (err.status) {
        res.status(err.status).send(err)
    } else {
        res.status(500).send({ msg: "internal server error" });
      }
});

module.exports = app;