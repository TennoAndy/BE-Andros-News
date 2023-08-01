const express = require("express");
const apiRouter = require("./routes/api-router");
const cors = require("cors");

const {
  handlePsqlErrors,
  handleNotAuthorError,
  handleCustomErrors,
  handleInvalidEndpoint,
} = require("./controllers/errors-controllers");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.all("/*", handleInvalidEndpoint);


app.use(handlePsqlErrors);
// app.use(handleNotAuthorError);
app.use(handleCustomErrors);

module.exports = app;
