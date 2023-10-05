const db = require('../db/connection');


exports.fetchArticleById = (id) => {
    return db
    .query(`
        SELECT * FROM articles
        WHERE article_id = $1
    `, [id])
    .then(({rows}) => {
        if (rows.length === 0) { 
            return Promise.reject({status: 404, msg: `No articles found for article_id: ${id}`})
        } else {
            return rows[0]
        }
    })
}


exports.fetchAllArticles = () => {
    const query =
        `SELECT 
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        CAST (COUNT(comments.article_id) AS INT) AS comment_count 
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`;

    return db.query(query).then(({rows}) => {
        return rows;
    });
}

exports.updateVotesByArticleId = (id, update = 0) => {
    console.log(update)    
    return db.query(`
            UPDATE articles
            SET votes = votes + $2
            WHERE article_id = $1
            RETURNING *;
            `, [id, update])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({status: 200, msg: `Article ${id} not found`})
            }
            return rows[0]
            
        })
}