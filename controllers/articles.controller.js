const { fetchArticleById, fetchAllArticles, updateVotesByArticleId } = require("../models/articles.model.js")

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

exports.patchVotesByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    let update = req.body;

    //if input an empty object send back orginal article
    if(Object.keys(update).length === 0) {
        update = { inc_votes : 0 };
    } 

    return updateVotesByArticleId(article_id, update)
        .then(article => res.status(200).send({article}))
        .catch(err => next(err));
}
