const { fetchArticleById, fetchAllArticles } = require("../models/articles.model.js")

exports.getArticleById = (req, res, next) => {
    const  { article_id } = req.params;
    
    fetchArticleById(article_id)
        .then(article => res.status(200).send({article}))
        .catch(err => next(err));
}

exports.getArticles = (req, res, next) => {

    fetchAllArticles()
        .then((articles) => res.status(200).send({articles}))
        .catch(err => next(err));

}