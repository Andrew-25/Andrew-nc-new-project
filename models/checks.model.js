const db = require('../db/connection');

exports.checkArticleExists = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: 'Not Found'});
            };
        });
};

exports.checkCommentExists = (id) => {
    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: 'Not Found'});
            };
        });
};