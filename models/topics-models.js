const db = require("../db/connection");
const format = require("pg-format");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => rows);
};

exports.checkTopicExists = async (topic) => {
  //check if user hasn't given a topic query
  if (!topic) return Promise.resolve;
  const { rows } = await db.query(`SELECT * FROM topics WHERE slug=$1`, [
    topic,
  ]);
  if (!rows[0]) { 
    return Promise.reject({ code: 404, msg: "Topic Not Found!" });
  }
};

