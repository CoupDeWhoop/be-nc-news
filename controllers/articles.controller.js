const { fetchArticleById, fetchAllArticles, updateVotesByArticleId } = require("../models/articles.model.js")

exports.getArticleById = (req, res, next) => {
    const  { article_id } = req.params;
    
    fetchArticleById(article_id)
        .then(article => res.status(200).send({article}))
        .catch(err => next(err));
}

exports.getArticles = (req, res, next) => {
    const { topic } = req.query;
    fetchAllArticles(topic) 
        .then((articles) => res.status(200).send({articles}))
        .catch(err => next(err));

}

exports.patchVotesByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const votes = req.body.inc_votes;
    return updateVotesByArticleId(article_id, votes)
        .then(article => res.status(200).send({article}))
        .catch(err => next(err));
}
