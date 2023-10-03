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
        COUNT(comments.article_id) AS comment_count 
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`;

    return db.query(query).then(({rows}) => {
        return rows;
    });
}