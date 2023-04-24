const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        console.log(rows.length);
        return Promise.reject({
          code: 404,
          msg: "Please enter a valid Article ID. Go back and try again.",
        });
      } else return rows[0];
    });
};
