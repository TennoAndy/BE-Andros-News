const db = require("../db/connection");


exports.selectUsers = async () => {
  const { rows } = await db.query(`SELECT * FROM users`);
  return rows;
};

exports.selectUserByUsername = async (username) => {
  const { rows } = await db.query(`SELECT * FROM users WHERE username=$1`, [
    username,
  ]);
  if (!rows[0]){
    return Promise.reject({
      code: 404,
      msg: "User either doesn't exist or you don't have access to their profile",
    });
  }
  return rows[0];
};

exports.checkUserExists = async (username) => {
  const { rows } = await db.query(
    `SELECT username FROM users WHERE username=$1`,
    [username]
  );
  if (!rows[0]) {
    return Promise.reject({ code: 404, msg: "User Not Found!" });
  }
};
