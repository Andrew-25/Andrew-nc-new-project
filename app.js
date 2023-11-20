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

module.exports = app;