const express = require('express');
const app = express();
const {
    getApi,
    getTopics,
    getArticlesById,
} = require('./controllers/app.controller');

app.get('/api/healthcheck', getApi);

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticlesById)

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad Request' });
    } else if (err.status === 404) {
        res.status(404).send({ msg: 'Not Found' });
    } else {
        res.status(500).send({ msg: 'Internal Server Error' })
    }
})

module.exports = app;