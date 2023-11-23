const db = require('../db/connection');

exports.checkArticleExists = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: 'Not Found'});
            };
        });
};

exports.checkKeysAreCorrect = (reqKeys, validKeys) => {
    const testKeys = Object.keys(reqKeys);
    const test = testKeys.filter((testKey) => !validKeys.includes(testKey))

    return Promise.resolve(test).then((data) => {
        if (data.length > 0) {
            return Promise.reject({ status: 400, msg: 'Bad Request' });
        };
    });
};

exports.checkKeysValidity = (reqKeys, validKeys) => {
    const testKeys = Object.keys(reqKeys);
    if (testKeys.length !== validKeys.length) {
        return Promise.reject({ status: 400, msg: 'Bad Request'});
    } else {
        validKeys.forEach((validKey) => {
            if (!testKeys.includes(validKey)) {
                return Promise.reject({ status: 400, msg: 'Bad Request'});
            };
        });
    };
};