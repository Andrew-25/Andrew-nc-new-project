const express = require('express');
const db = require('../db/connection');
const {
    findTopics,
    findArticlesById,
} = require("../models/app.model");

exports.getApi = (req, res) => { res.status(200).send({ msg: 'working' }) };

exports.getTopics = (req, res) => {
    findTopics().then((data) => {
        res.status(200).send({ topics: data.rows });
    })
};

exports.getArticlesById = (req, res, next) => {
    findArticlesById(req.params.article_id)
    .then((data) => {
        if (!data.rows.length) throw new Error('404');
        res.status(200).send({ article: data.rows });
    })
    .catch(next)
}