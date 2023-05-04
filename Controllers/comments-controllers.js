const {
  selectCommentsByArticleId,
  insertComment,
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

exports.postComment = async (req, res, next) => {
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
