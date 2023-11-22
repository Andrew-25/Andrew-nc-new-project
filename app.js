const express = require('express');
const app = express();
const {
    getApi,
    getEndpoints,
    getTopics,
    getArticles,
    getArticlesById,
    getArticleComments,
    postComment,
} = require('./controllers/app.controller');

app.use(express.json());

app.get('/api/healthcheck', getApi);
app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticlesById);
app.get('/api/articles/:article_id/comments', getArticleComments);

app.post('/api/articles/:article_id/comments', postComment)

app.use((err, req, res, next) => {
    // console.log(err.status)
    if (err.code === '22P02' || err.code === '23503') {
        res.status(400).send({ msg: 'Bad Request' });
    } else if (err.status === 404) {
        res.status(404).send({ msg: 'Not Found' });
    } else if (err.status === 406) {
        res.status(406).send({ msg: 'Not Acceptable' });
    } else {
        res.status(500).send({ msg: 'Internal Server Error' });
    };
});

module.exports = app;