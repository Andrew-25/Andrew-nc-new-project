const db = require('../db/connection');

exports.checkArticleExists = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: 'Not Found'});
            };
        });
};

exports.checkKeysAreCorrect = (request) => {
    if (Object.keys(request).length !== 2) {
        return Promise.reject({ status: 406, msg: 'Not Acceptable'});
    };
};