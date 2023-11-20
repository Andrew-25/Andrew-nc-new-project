const db = require('../db/connection');
const {
    findEndpoints,
    findTopics,
} = require("../models/app.model");

exports.getApi = (req, res) => { res.status(200).send({ msg: 'working' }) };

exports.getEndpoints = (req, res) => {
    findEndpoints().then((data) => {
        res.status(200).send({ endpoints: data })
    })
}

exports.getTopics = (req, res) => {
    findTopics().then((data) => {
        res.status(200).send({ topics: data.rows });
    })
};