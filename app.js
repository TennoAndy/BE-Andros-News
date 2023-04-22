const express = require("express");
const { getTopics } = require("./Controllers/topics-controllers");
const { handleInvalidEndpoint } = require("./Controllers/errors-controllers");
const { getArticleById } = require("./Controllers/articles-controllers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);



app.all("/*", handleInvalidEndpoint);

module.exports = app;
