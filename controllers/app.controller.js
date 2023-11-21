const express = require('express');
const db = require('../db/connection');
const {
    findEndpoints,
    findTopics,
    findArticles,
    findArticlesById,
} = require("../models/app.model");

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
        .then((data, err) => {
            res.status(200).send({ article: data.rows });
        })
        .catch(next);
};