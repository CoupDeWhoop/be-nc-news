const db = require('../db/connection');

exports.fetchArticleById = (id) => {
    
    if (isNaN(Number(id))){
        return Promise.reject({status: 400, msg: `Article id should be a number`})
    }
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