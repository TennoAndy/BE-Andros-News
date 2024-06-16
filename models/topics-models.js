const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => rows);
};

exports.checkTopicExists = async (topic) => {
  //check if user hasn't given an existing topic query
  if (!topic) return Promise.resolve;
  const { rows } = await db.query(`SELECT * FROM topics WHERE slug=$1`, [
    topic,
  ]);
  if (!rows[0]) {
    return Promise.reject({ code: 404, msg: "Topic Not Found!" });
  }
};

exports.insertTopic = async ({ slug, description }) => {
  if (!slug || !description) {
    return Promise.reject({ code: 400, msg: "Missing Required Fields!" });
  }
  const { rows } = await db.query(
    `INSERT INTO topics (slug,description) VALUES ($1, $2) RETURNING *`,
    [slug, description]
  );
  return rows[0];
};
