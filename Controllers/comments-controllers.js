const { selectCommentsByArticleId } = require("../models/comments-models");

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
