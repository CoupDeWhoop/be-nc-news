const db = require('../db/connection.js');
const endpoints = require('../endpoints.json')


exports.fetchTopics = () => {

    let query = `SELECT * FROM topics;`

    return db.query(query).then((result) => {
        return result.rows;
    });
}