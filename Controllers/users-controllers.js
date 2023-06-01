const {
  selectUsers,
  selectUserByUsername,
  checkUserExists,
} = require("../models/users-models");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await selectUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  try {
    const username = req.params.username;
    const [, user] = await Promise.all([
      checkUserExists(username),
      selectUserByUsername(username), 
    ]);

    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};
