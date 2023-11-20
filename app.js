const express = require('express');
const app = express();
const {
    getApi,
    getTopics
} = require('./controllers/app.controller');

app.get('/api/healthcheck', getApi);
app.get('/api/topics', getTopics)

module.exports = app;