const express = require('express');
const app = express();
const {
    getApi,
    getEndpoints,
    getTopics,
    getArticles,
} = require('./controllers/app.controller');

app.get('/api/healthcheck', getApi);
app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);

module.exports = app;