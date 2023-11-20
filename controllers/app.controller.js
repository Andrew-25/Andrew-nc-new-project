const db = require('../db/connection');
const {
    findTopics,
} = require("../models/app.model");

exports.getApi = (req, res) => { res.status(200).send({ msg: 'working' }) };

exports.getTopics = (req, res) => {
    findTopics().then((data) => {
        res.status(200).send({ topics: data.rows });
    })
};