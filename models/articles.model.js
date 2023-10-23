const db = require('../db/connection');
const { checkTopicExists } = require('../models/topics.model.js');



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
        GROUP BY articles.article_id;
    `, [id])
    .then(({rows}) => {
        if (rows.length === 0) { 
            return Promise.reject({status: 404, msg: `Article ${id} not found`})
        } else {
            return rows[0]
        }
    })
}


exports.fetchAllArticles = (topic, sort_by='created_at') => {
    const validSortBys = {
        created_at: 'created_at',
        title: 'title',
        author: 'author',
        article_id: 'article_id',
        topic: 'topic',
        votes: 'votes',
        comment_count: 'comment_count',
      };
    
      if (!(sort_by in validSortBys)) {
        return Promise.reject({ status: 400, msg: 'Invalid sort by query' });
      }
    
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
          CAST(COUNT(comments.article_id) AS INT) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id`;

    let checkTopicPromise = Promise.resolve(); // this allows us to deal with the aynschronous checkTopicExists()

    if (topic) {
      checkTopicPromise = checkTopicExists(topic).then(() => {
        queryValues.push(topic);
        queryStr += ' WHERE articles.topic = $1';
      });
    }
  
    return checkTopicPromise.then(() => {
      queryStr += ` GROUP BY articles.article_id ORDER BY ${validSortBys[sort_by]} DESC;`;
      return db.query(queryStr, queryValues).then(({ rows }) => {
        return rows;
      });
    });
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