const { selectArticleById } = require("../models/articles-models");

// exports.getArticleById = (req, res, next) => {
//   const articleId = req.params.article_id;
//   selectArticleById(+articleId)
//     .then((article) => res.status(200).send({ article }))
//     .catch(next);
// };

exports.getArticleById = async (req, res, next) => {
  try {
    const articleId = req.params.article_id;
    const article = await selectArticleById(+articleId);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};
