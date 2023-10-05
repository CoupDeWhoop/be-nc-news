const { fetchCommentsById, insertComment } = require("../models/comments.model.js")

exports.getCommentsById = (req, res, next) => {
    const { article_id } = req.params;
    fetchCommentsById(article_id)
        .then((comments) => res.status(200).send({ comments }))
        .catch(err => {
            next(err)
        });
}

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const { body, username } = req.body;
    insertComment(body, article_id, username)
        .then((comment) => {
            res.status(201).send({ comment })
        })
        .catch(err => next(err))
} 