const express = require("express");
const { getTopics } = require("./Controllers/topics-controllers");
const {
  handlePqslErrors,
  handleNotAuthorError,
  handleCustomErrors,
  handleInvalidEndpoint,
} = require("./Controllers/errors-controllers");
const {
  getArticleById,
  getArticles,
  patchArticle,
} = require("./Controllers/articles-controllers");

const {
  getCommentsByArticleId,
  postComment,
} = require("./Controllers/comments-controllers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);

app.all("/*", handleInvalidEndpoint);

//to next ksekinaei apo edw kai katw.

app.use(handlePqslErrors);
// app.use(handleNotAuthorError);
app.use(handleCustomErrors);

module.exports = app;
