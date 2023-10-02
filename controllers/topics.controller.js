const { fetchTopics } = require("../models/topics.model.js")
const endpoints = require('../endpoints.json')

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics});
      }).catch((err) => {
        console.log(err)
        next(err);
      })
}

exports.getEndpoints = (req, res, next) => {
    res.status(200).send({endpoints})
        .catch((err) => {
            next(err)
        })
}