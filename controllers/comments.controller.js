const { fetchCommentsById, insertComment } = require("../models/comments.model.js")
const { fetchArticleById } = require('../models/articles.model')

exports.getCommentsById = (req, res, next) => {
    const { article_id } = req.params;
    
    Promise.all([fetchCommentsById(article_id), fetchArticleById(article_id)])
    .then((results) => {
        res.status(200).send({comments: results[0]})
    }) 
    .catch(err => {
        next(err)
    });
    
    // fetchCommentsById(article_id)
    //     .then((comments) => res.status(200).send({ comments }))
    //     .catch(err => {
    //         next(err)
    //     });
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