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
    `SELECT articles.*, COUNT(comment_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
    [id]
  );
  if (rows.length === 0)
    return Promise.reject({
      code: 404,
      msg: "Please enter a valid Article ID. Go back and try again.",
    });

  return rows[0];
};

exports.selectArticles = async (
  topic,
  sort_by = `created_at`,
  order = `DESC`
) => {
  const acceptedSortBy = [
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
  ];
  if (!acceptedSortBy.includes(sort_by))
    return Promise.reject({
      code: 400,
      msg: "Please enter valid sort order!",
    });
  if (order !== `DESC` && order !== `ASC`)
    return Promise.reject({
      code: 400,
      msg: "Please enter valid order. Order should be ASC(ascending) or DESC(descending)",
    });

  let query = `SELECT articles.*, COUNT(comments.article_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id`;

  const queryArr = [];

  if (topic) {
    query += ` WHERE articles.topic=$1 GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;
    queryArr.push(topic);
  } else {
    query += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;
    // queryArr.push(sort_by, order);
  }

  const { rows } = await db.query(query, queryArr);
  return rows;
};

exports.checkArticleExists = async (articleId) => {
  const { rows } = await db.query(
    `SELECT article_id FROM articles WHERE article_id=$1`,
    [articleId]
  );
  if (!rows[0]) {
    return Promise.reject({ code: 404, msg: "Article Not Found!" });
  }
};

exports.updatedArticle = async (updates, id) => {
  const { rows } = await db.query(
    `UPDATE articles SET votes=votes + $1 WHERE article_id=$2 RETURNING *`,
    [updates.votes, id]
  );
  return rows[0];
};
