const express = require("express");
const { getTopics } = require("./Controllers/topics-controllers");
const {
  handlePsqlErrors,
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
  deleteComment,
} = require("./Controllers/comments-controllers");

const { getUsers } = require("./Controllers/users-controllers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.patch("/api/articles/:article_id", patchArticle);

app.get("/api/users", getUsers);

app.all("/*", handleInvalidEndpoint);

//to next ksekinaei apo edw kai katw.

app.use(handlePsqlErrors);
// app.use(handleNotAuthorError);
app.use(handleCustomErrors);

module.exports = app;
