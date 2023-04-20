const express = require("express");
const { getTopics } = require("./Controllers/topics-controllers");
const { handleInvalidEndpoint } = require("./Controllers/errors-controllers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.all("/*", handleInvalidEndpoint);

module.exports = app;
