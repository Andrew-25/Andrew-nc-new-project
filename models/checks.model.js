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

exports.checkValidQueries = (topic, sort, order) => {
    const promises = [
        checkValidTopics(topic),
        checkValidSorts(sort),
        checkValidOrders(order)
    ]

    return Promise.all(promises)
}

const checkValidOrders = (order) => {
    const validOrders = ['asc', 'desc']
    if (order) {
        if (!validOrders.includes(order)) {
            return Promise.reject({ status: 400, msg: 'Bad Request'});
        }
    }
}

const checkValidSorts = (sort) => {
    const validSorts = ["title", "topic", "author", "body", "created_at", "votes", "comment_count"]
    if (sort) {
        if (!validSorts.includes(sort)) {
            return Promise.reject({ status: 400, msg: 'Bad Request'});
        }
    }
}

const checkValidTopics = (topic) => {
    if (topic) {
        return db.query(`SELECT slug FROM topics`).then((data) => {
            const validTopics = data.rows.map((topic) => topic.slug)
            return Promise.resolve(validTopics)
        }).then((data) => {
            if (!data.includes(topic)) {
                return Promise.reject({ status: 400, msg: 'Bad Request'});
            }
        })
    }
}