const db = require('../db/connection');

exports.fetchCommentsByArticleId = (article_id) => {
    const query = `
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`

    return db.query(query, [article_id]).then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status:200, msg: `Article ${article_id} has no comments`})
        } else {
            return rows;
        }
    });

}


exports.insertComment = (body, article_id, username) => {
    return db
        .query(`
            INSERT INTO comments
            (article_id, body, author)
            VALUES
            ($1, $2, $3)
            RETURNING *;
            `, [article_id, body, username])
        .then(({rows}) => {
            return rows[0]
        })
}

exports.eraseCommentByCommentId = (id) => {
    return db
        .query(`
            DELETE FROM comments
            WHERE comment_id = $1;
        `, [id])
        .then(({rowCount}) => {
            if (rowCount === 0) {
                return Promise.reject({status: 404, msg: `Comment does not exist`})
            }
        })
}