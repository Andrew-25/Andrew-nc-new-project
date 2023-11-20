const db = require('../db/connection');
const endpoints = require('../endpoints.json')
const format = require("pg-format");

exports.findEndpoints = () => { return Promise.resolve(endpoints)}

exports.findTopics = () => { return db.query(`SELECT * FROM topics;`) };