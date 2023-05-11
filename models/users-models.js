const db = require("../db/connection");
const format = require("pg-format");

exports.selectUsers = async () => {
  const { rows } = await db.query(`SELECT * FROM users`);
  return rows;
};
