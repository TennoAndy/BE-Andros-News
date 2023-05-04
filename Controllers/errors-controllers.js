exports.handlePqslErrors = (err, req, res, next) => {
  if (err.code === "23502" || err.code === "22P02" || err.code === "23503") {
    res.status(400).send({ msg: "Bad request!" });
  } else next(err);
};
// exports.handleNotAuthorError = (err, req, res, next) => {
//   if (err.code === 401) res.status(401).send({ msg: err.msg });
// };
exports.handleCustomErrors = (err, req, res, next) => {
  if (err.code === 404 || err.code === 400) {
    res.status(err.code).send({ msg: err.msg });
  } else next(err);
};

exports.handleInvalidEndpoint = (req, res, next) => {
  res
    .status(404)
    .send({ msg: "Please enter a valid link. Go back and try again." });
};
