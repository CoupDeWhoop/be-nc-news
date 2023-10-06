const db = require('../db/connection.js');

exports.fetchTopics = () => {

    let query = `SELECT * FROM topics;`

    return db.query(query).then((result) => {
        return result.rows;
    });
}

exports.checkTopicExists = (topic) => {
    return db.query(
        `SELECT * FROM topics WHERE topics.slug = $1;`,
        [topic]
    ).then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'topic not found' });
        }
    })
}


