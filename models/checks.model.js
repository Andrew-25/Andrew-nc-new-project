const db = require('../db/connection');

exports.checkArticleExists = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: 'Not Found'});
            };
        });
};

exports.checkKeysValidity = (reqKeys, validKeys) => {
    const testKeys = Object.keys(reqKeys);
    if (testKeys.length !== validKeys.length) {
        return Promise.reject({ status: 406, msg: 'Not Acceptable'});
    } else {
        validKeys.forEach((validKey) => {
            if (!testKeys.includes(validKey)) {
                return Promise.reject({ status: 406, msg: 'Not Acceptable'});
            };
        });
    };
};