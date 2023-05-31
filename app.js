const express = require("express");
const apiRouter = require("./routes/api-router");

const {
  handlePsqlErrors,
  handleNotAuthorError,
  handleCustomErrors,
  handleInvalidEndpoint,
} = require("./controllers/errors-controllers");

const app = express();
app.use(express.json());
app.use("/api", apiRouter);

app.all("/*", handleInvalidEndpoint);

//to next ksekinaei apo edw kai katw.

app.use(handlePsqlErrors);
// app.use(handleNotAuthorError);
app.use(handleCustomErrors);

module.exports = app;
