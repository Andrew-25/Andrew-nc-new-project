const db = require('../db/connection');
const endpoints = require('../endpoints.json')
const format = require("pg-format");

exports.findEndpoints = () => { return Promise.resolve(endpoints)}

exports.findTopics = () => { return db.query(`SELECT * FROM topics;`) };

exports.findArticles = () => {
    return db.query(`
        SELECT articles.author, title, articles.article_id, topic,
            articles.created_at, articles.votes, article_img_url,
            CAST(COUNT(comments.article_id) AS INT) AS comment_count
        FROM articles
        LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;
    `)
}