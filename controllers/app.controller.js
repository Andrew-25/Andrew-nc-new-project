const db = require('../db/connection');

exports.getApi = (req, res) => {
  res.status(200).send({ msg: 'working' });
};
