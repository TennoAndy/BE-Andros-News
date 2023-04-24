const db = require("../db/connection");
const format = require("pg-format");

// exports.selectArticleById = (id) => {
//   return db
//     .query(`SELECT * FROM articles WHERE article_id=$1`, [id])
//     .then(({ rows }) => {
//       if (rows.length === 0) {
//         return Promise.reject({
//           code: 404,
//           msg: "Please enter a valid Article ID. Go back and try again.",
//         });
//       } else return rows[0];
//     });
// };
exports.selectArticleById = async (id) => {
  const { rows } = await db.query(
    `SELECT * FROM articles WHERE article_id=$1`,
    [id]
  );
  if (rows.length === 0)
    return Promise.reject({
      code: 404,
      msg: "Please enter a valid Article ID. Go back and try again.",
    });

  return rows[0];
};
exports.selectArticles = async () => {
  const { rows } = await db.query(
    `SELECT articles.article_id, 
    articles.title, 
    articles.topic, 
    articles.author, 
    articles.created_at, 
    articles.votes, articles.article_img_url, COUNT(comments.article_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC `
  );
  console.log(rows);
  return rows;
};
