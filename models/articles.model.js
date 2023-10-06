const db = require('../db/connection');
const { checkTopicExists } = require('./topics.model');


exports.fetchArticleById = (id) => {


    return db
    .query(`
        SELECT 
        articles.author, 
        articles.title, 
        articles.article_id, 
        articles.topic, 
        articles.body,
        articles.created_at, 
        articles.votes, 
        articles.article_img_url, 
        CAST (COUNT(comments) AS INT) as comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;
    `, [id])
    .then(({rows}) => {
        if (rows.length === 0) { 
            return Promise.reject({status: 404, msg: `Article ${id} not found`})
        } else {
            return rows[0]
        }
    })
}


exports.fetchAllArticles = (topic) => {
    const queryValues = [];
    let queryStr = `
        SELECT 
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
        ON articles.article_id = comments.article_id`

    if (topic) {
        return checkTopicExists(topic)
        .then(() => {
            queryValues.push(topic)
            queryStr += ` WHERE articles.topic = $1`
            queryStr += ` GROUP BY articles.article_id ORDER BY articles.created_at DESC;`;
            return db.query(queryStr, queryValues).then(({rows}) => {
                return rows;
            });
        })
    } else {
        queryStr += ` GROUP BY articles.article_id ORDER BY articles.created_at DESC;`;
        return db.query(queryStr, queryValues).then(({rows}) => {
            return rows;
        });
    }
}

exports.updateVotesByArticleId = (id, update = 0) => {    
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