const { selectTopics } = require("../models/topics.model.js")

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        console.log(topics)
        res.status(200).send({ topics});
      }).catch((err) => {
        console.log(err)
        next(err);
      })
}