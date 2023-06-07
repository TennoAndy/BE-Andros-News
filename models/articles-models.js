const db = require("../db/connection");

exports.selectArticleById = async (id) => {
  const { rows } = await db.query(
    `SELECT articles.*, COUNT(comment_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
    [id]
  );
  if (rows.length === 0)
    return Promise.reject({
      code: 404,
      msg: "Article Not Found!",
    });

  return rows[0];
};

exports.selectArticles = async (
  topic,
  sort_by = `created_at`,
  order = `DESC`,
  limit = 10,
  p = 1
) => {
  const acceptedSortBy = ["title", "topic", "author", "created_at", "votes"];

  if (!acceptedSortBy.includes(sort_by))
    return Promise.reject({
      code: 400,
      msg: "Please enter a valid sort order!",
    });

  if (order.toLowerCase() !== `desc` && order.toLowerCase() !== `asc`)
    return Promise.reject({
      code: 400,
      msg: "Please enter a valid order. Order should be ASC(ascending) or DESC(descending)",
    });

  if (Number.isNaN(Number(limit))) {
    return Promise.reject({
      code: 400,
      msg: "Please enter a valid limit. Limit should be a number!",
    });
  }

  if (Number.isNaN(Number(p))) {
    return Promise.reject({
      code: 400,
      msg: "Please enter a valid p. P should be a number!",
    });
  }

  let query = `SELECT articles.*, COUNT(comments.article_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id`;
  let offset = (p - 1) * limit;

  const queryArr = [offset];

  const limitValue = limit == 0 ? "ALL" : limit;

  if (topic) {
    query += ` WHERE articles.topic=$2 GROUP BY articles.article_id ORDER BY ${sort_by} ${order.toLowerCase()} LIMIT ${limitValue} OFFSET $1`;
    queryArr.push(topic);
  } else {
    query += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order.toLowerCase()} LIMIT ${limitValue} OFFSET $1`;
  }

  const limitlessArr = [];

  let limitlessQuery = `SELECT * FROM articles`;

  if (topic) {
    limitlessQuery += ` WHERE articles.topic=$1`;
    limitlessArr.push(topic);
  }

  const [articlesResult, limitlessArticlesResult] = await Promise.all([
    db.query(query, queryArr),
    db.query(limitlessQuery, limitlessArr),
  ]);

  const { rows: articles } = articlesResult;
  const { rows: limitlessArticles } = limitlessArticlesResult;
  const total_count = limitlessArticles.length;
  if (
    Math.ceil(total_count / limit) > 0 &&
    p > Math.ceil(total_count / limit)
  ) {
    return Promise.reject({
      code: 404,
      msg: "Please provide valid values.Limit or p cannot be greater than the total number of articles!",
    });
  }
  return { articles, total_count };
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

exports.updateArticleById = async (updates, id) => {
  const { rows } = await db.query(
    `UPDATE articles SET votes=votes + $1 WHERE article_id=$2 RETURNING *`,
    [updates.votes, id]
  );
  return rows[0];
};

exports.insertArticle = async ({ author, title, body, topic }) => {
  if (!author || !title || !body || !topic) {
    return Promise.reject({ code: 400, msg: "No Article Submitted!" });
  }
  const { rows } = await db.query(
    `INSERT INTO articles (author,title, body, topic) VALUES ($1, $2, $3, $4) RETURNING *`,
    [author, title, body, topic]
  );
  rows[0].comment_count = 0;
  return rows[0];
};

exports.deleteArticleById = async (id) => {
  const { rows } = await db.query(
    `DELETE FROM articles WHERE article_id=$1 RETURNING *`,
    [id]
  );
  if (rows.length === 0)
    return Promise.reject({
      code: 404,
      msg: "Article doesn't exist!",
    });
  return rows[0];
};
