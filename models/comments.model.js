const db = require('../db/connection');
const { checkArticleIdExists } = require("../models/articles.model.js")

exports.fetchCommentsById = (article_id) => {
  


    const fetchCommentsPromise = (article_id) =>{
        
        const query = `
            SELECT * FROM comments
            WHERE article_id = $1
            ORDER BY created_at DESC;`
    
        return db.query(query, [article_id]).then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({status:200, msg: "article_id has no comments"})
            } else {
                return result.rows;
            }
        });
    }


    //checks article_id exists && fetches comments
    return Promise.all([fetchArticleById(article_id), fetchCommentsPromise(article_id)])
        .then((results) => {
            return results[1]
        })

}


exports.insertComment = (body, article_id, username) => {

    if (!username) {
        return Promise.reject({status: 400, msg: 'Please provide username.'})
    }

    if (!body) {
        return Promise.reject({status: 400, msg: 'Please provide comment body.'})
    }

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