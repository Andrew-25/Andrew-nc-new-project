const db = require('../db/connection');
const endpoints = require('../endpoints.json')
const format = require("pg-format");

exports.findEndpoints = () => { return Promise.resolve(endpoints)}

exports.findTopics = () => { return db.query(`SELECT * FROM topics;`) };

exports.findArticlesById = (id) => { 
    return db.query(`
        SELECT * FROM articles
        WHERE article_id = $1;
    `, [id])
        .then((articles) => {
            if (!articles.rows.length) {
                return Promise.reject({ status: 404, msg: 'Not Found'})
            } else {
                return articles
            }
        })
}

exports.findArticleComments = (id) => {
    return db.query(`
        SELECT comment_id, comments.votes, comments.created_at,
        comments.author, comments.body, comments.article_id
        FROM comments
        JOIN articles on comments.article_id = articles.article_id
        WHERE comments.article_id = $1
        ORDER BY comments.created_at DESC;
    `, [id]);
};
