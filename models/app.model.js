const db = require('../db/connection');
const format = require("pg-format");

exports.findTopics = () => { return db.query(`SELECT * FROM topics;`) };