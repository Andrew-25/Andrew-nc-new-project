const express = require('express');
const db = require('../db/connection');
const {
    findEndpoints,
    findTopics,
    findArticles,
    findArticlesById,
    findArticleComments,
    removeComment,
} = require("../models/app.model");
const { 
    checkArticleExists,
    checkCommentExists,
} = require('../models/checks.model')

exports.getApi = (req, res) => { res.status(200).send({ msg: 'working' }) };

exports.getEndpoints = (req, res) => {
    findEndpoints().then((data) => {
        res.status(200).send({ endpoints: data });
    });
};

exports.getTopics = (req, res) => {
    findTopics().then((data) => {
        res.status(200).send({ topics: data.rows });
    });
};

exports.getArticles = (req, res) => {
    findArticles().then((data) => {
        res.status(200).send({ articles: data.rows });
    });
};

exports.getArticlesById = (req, res, next) => {
    const { article_id } = req.params;
    findArticlesById(article_id)
        .then((data) => {
            res.status(200).send({ article: data.rows });
        })
        .catch(next)
}

exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    const articlePromises = [
        findArticleComments(article_id),
        checkArticleExists(article_id)
    ];
    
    Promise.all(articlePromises)
        .then((data) => {
            res.status(200).send({ comments: data[0].rows });
        })
        .catch(next);
};

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    const commentPromises = [
        checkCommentExists(comment_id),
        removeComment(comment_id),
    ];
    
    Promise.all(commentPromises).then((data) => {
        res.status(204).send({ comment: data.rows });
    })
    .catch(next);
}