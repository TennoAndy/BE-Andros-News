exports.handlePqslErrors = (err, req, res, next) => {
  console.log(err);
  if (err.code === "23502" || err.code === "22P02") {
    res.status(400).send({ msg: "Bad request!" });
  } else next(err);
};
// exports.handleNotAuthorError = (err, req, res, next) => {
//   if (err.code === 401) res.status(401).send({ msg: err.msg });
// };
exports.handleCustomErrors = (err, req, res, next) => {
  if (err.code === 404) {
    res.status(404).send({ msg: err.msg });
  } else next(err);
};

exports.handleInvalidEndpoint = (req, res, next) => {
  res
    .status(404)
    .send({ msg: "Please enter a valid link. Go back and try again." });
};
