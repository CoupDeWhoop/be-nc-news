const db = require('../db/connection');

exports.fetchCommentsById = (article_id) => {

    let query = `SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`

    return db.query(query, [article_id]).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "article_id not found"})
        }
        return result.rows;
    });
}