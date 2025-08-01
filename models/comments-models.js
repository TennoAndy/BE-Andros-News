const db = require("../db/connection");
const format = require("pg-format");

exports.selectCommentsByArticleId = async (id, limit = 10, p = 1) => {
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

  let offset = (p - 1) * limit;
 
  limit = limit == 0 ? `ALL` : limit;

  const queryArr = [id, limit, offset];

  let query = `SELECT * FROM comments WHERE article_id=%L ORDER BY created_at DESC LIMIT %s OFFSET %L`;
  let limitlessQuery = `SELECT * FROM comments WHERE article_id=$1`;

  const formattedQuery = format(query, ...queryArr);

  const [commentResult, limitlessQueryResult] = await Promise.all([
    db.query(formattedQuery),
    db.query(limitlessQuery, [id]),
  ]);

  const { rows: comments } = commentResult;
  const { rows: limitlessComments } = limitlessQueryResult;
  const total_count = limitlessComments.length;

  if (
    Math.ceil(total_count / limit) > 0 &&
    p > Math.ceil(total_count / limit)
  ) {
    return Promise.reject({
      code: 404,
      msg: "Please provide valid values.Limit or p cannot be greater than the total number of comments!",
    });
  }

  return { comments, total_count };
};

exports.insertComment = async ({ author, body }, articleId) => {
  if (!author || !body) {
    return Promise.reject({ code: 400, msg: "No comment submitted" });
  }
  const { rows } = await db.query(
    `INSERT INTO comments (article_id,author,body) VALUES ($1, $2, $3) RETURNING *`,
    [articleId, author, body]
  );
  return rows[0];
};

exports.deleteCommentById = async (id) => {
  const { rows } = await db.query(
    `DELETE FROM comments WHERE comment_id=$1 RETURNING *`,
    [id]
  );
  if (rows.length === 0)
    return Promise.reject({
      code: 404,
      msg: "Comment doesn't exist!",
    });
};

exports.updateCommentById = async (updates, id) => {
  const { rows } = await db.query(
    `UPDATE comments SET votes=votes + $1 WHERE comment_id=$2 RETURNING *`,
    [updates, id]
  );
  if (rows.length === 0)
    return Promise.reject({
      code: 404,
      msg: "Comment Not Found!",
    });

  return rows[0];
};
