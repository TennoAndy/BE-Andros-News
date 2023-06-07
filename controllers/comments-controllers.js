const {
  selectCommentsByArticleId,
  insertComment,
  deleteCommentById,
  checkCommentExists,
  updateCommentById,
} = require("../models/comments-models");
const { checkArticleExists } = require("../models/articles-models");

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const { limit, p } = req.query;
    const articleId = req.params.article_id;
    const [, { comments, total_count }] = await Promise.all([
      checkArticleExists(articleId),
      selectCommentsByArticleId(articleId, limit, p),
    ]);
    res.status(200).send({ comments, total_count });
  } catch (err) {
    next(err);
  }
};

exports.postCommentByArticleId = async (req, res, next) => {
  try {
    const comment = req.body;
    const articleId = req.params.article_id;
    const [, newComment] = await Promise.all([
      checkArticleExists(articleId),
      insertComment(comment, articleId),
    ]);
    res.status(201).send({ newComment });
  } catch (err) {
    next(err);
  }
};

exports.deleteCommentById = async (req, res, next) => {
  try {
    const deleteId = req.params.comment_id;
    const deleteComment = await deleteCommentById(deleteId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.patchCommentById = async (req, res, next) => {
  try {
    const commentId = req.params.comment_id;
    const update = req.body.votes;
    const updateComment = await updateCommentById(update, commentId);
    res.status(200).send({ updateComment });
  } catch (err) {
    next(err);
  }
};
