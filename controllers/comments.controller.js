const { fetchCommentsByArticleId, insertComment, eraseCommentByCommentId } = require("../models/comments.model.js")
const { fetchArticleById } = require('../models/articles.model')

exports.getCommentsById = (req, res, next) => {
    const { article_id } = req.params;
    
    Promise.all([fetchArticleById(article_id), fetchCommentsByArticleId(article_id)])
    .then((results) => {
        res.status(200).send({comments: results[1]})
    }) 
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

exports.deleteCommentByCommentId = (req, res, next) => {
    const {comment_id} = req.params;
    
    eraseCommentByCommentId(comment_id)
        .then(() => res.status(204).send())
        .catch(err => {
            next(err)
        })
}