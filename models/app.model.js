const db = require('../db/connection');
const endpoints = require('../endpoints.json');
const format = require("pg-format");

exports.findEndpoints = () => { return Promise.resolve(endpoints)};

exports.findTopics = () => { return db.query(`SELECT * FROM topics;`) };

exports.findArticles = (topic, sort = 'created_at', order = 'DESC') => {
    let sql = `
        SELECT articles.author, title, articles.article_id, topic,
            articles.created_at, articles.votes, article_img_url,
            CAST(COUNT(comments.article_id) AS INT) AS comment_count
        FROM articles
        LEFT OUTER JOIN comments ON articles.article_id = comments.article_id 
    `
    if (topic) sql += `WHERE topic = '${topic}' `
    
    sql += `GROUP BY articles.article_id
            ORDER BY ${sort} ${order}`

    return Promise.resolve(db.query(sql)).then((data) => {
        return data.rows
    })
};

exports.findArticlesById = (id) => { 
    return db.query(`
        SELECT 
            articles.article_id, title, topic, articles.author,
            articles.body, articles.created_at, articles.votes,
            article_img_url, CAST(COUNT(comments.article_id) AS INT) AS comment_count
        FROM articles
        LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;
    `, [id])
        .then((articles) => {
            if (!articles.rows.length) {
                return Promise.reject({ status: 404, msg: 'Not Found'});
            } else {
                return articles;
            };
        });
};

exports.findArticleComments = (id) => {
    return db.query(`
        SELECT comment_id, comments.votes, comments.created_at,
        comments.author, comments.body, comments.article_id
        FROM comments
        LEFT OUTER JOIN articles on comments.article_id = articles.article_id
        WHERE comments.article_id = $1
        ORDER BY comments.created_at DESC;
    `, [id]);
};

exports.createComment = (article_id, username, body = '') => {
    const sql = format(`
        INSERT INTO comments
            (article_id, author, body)
        VALUES %L RETURNING*;
    `, [[article_id, username, body]]);
    return db.query(sql);
};

exports.alterArticle = (id, value) => {
    return db.query(`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
    `, [value, id]);
};

exports.removeComment = (id) => {
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1;
    `, [id]);
};

exports.findUsers = () => { 
    const promisedUsers =  db.query('SELECT * FROM users;') 
    return Promise.resolve(promisedUsers).then((data) => {
        return data.rows;
    });
};