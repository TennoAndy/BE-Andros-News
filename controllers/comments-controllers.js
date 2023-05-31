const {
  selectCommentsByArticleId,
  insertComment,
  deleteCommentById,
  checkCommentExists,
} = require("../models/comments-models");
const { checkArticleExists } = require("../models/articles-models");

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const articleId = req.params.article_id;
    const comments = await selectCommentsByArticleId(+articleId);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

// exports.getCommentsByArticleId = (req, res, next) => {
//   const articleId = req.params.article_id;
//   console.log(articleId, "EDWWWWWWWWWWWWWWWW");
//   selectCommentsByArticleId(+articleId)
//     .then((comments) => res.status(200).send({ comments }))
//     .catch(next);
// };

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
    const commentDeleted = await deleteCommentById(deleteId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
