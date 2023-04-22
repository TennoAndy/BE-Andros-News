const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [id])
    .then(({ rows }) => rows[0]);
};
