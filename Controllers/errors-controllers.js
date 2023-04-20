exports.handleInvalidEndpoint = (req, res) => {
  res
    .status(404)
    .send({ msg: "Please enter a valid link. Go back and try again." });
};
