const { fetchArticleById, fetchAllArticles, updateVotesByArticleId } = require("../models/articles.model.js")
const { checkTopicExists } = require('../models/topics.model.js');

exports.getArticleById = (req, res, next) => {
    const  { article_id } = req.params;
    
    fetchArticleById(article_id)
        .then(article => res.status(200).send({article}))
        .catch(err => next(err));
}

exports.getArticles = (req, res, next) => {
    const { topic } = req.query;

    // to avoid repeating code the result of the promise is stored in the promise variable
    // if topic doesn't exist code ends here
    const fetchArticlesPromise = topic
    ? checkTopicExists(topic).then(() => fetchAllArticles(topic))
    : fetchAllArticles();

    fetchArticlesPromise
        .then((articles) => res.status(200).send({ articles }))
        .catch((err) => next(err));
}

exports.patchVotesByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const votes = req.body.inc_votes;
    return updateVotesByArticleId(article_id, votes)
        .then(article => res.status(200).send({article}))
        .catch(err => next(err));
}
