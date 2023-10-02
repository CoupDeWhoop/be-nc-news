const db = require('../db/connection.js');

exports.selectTopics = () => {

    let query = `SELECT * FROM topics;`

    return db.query(query).then((result) => {
        return result.rows;
        });
}