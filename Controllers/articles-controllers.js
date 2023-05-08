const {
  selectArticleById,
  selectArticles,
  updatedArticle,
  checkArticleExists,
} = require("../models/articles-models");

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

exports.getArticles = async (req, res, next) => {
  try {
    const articles = await selectArticles();
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.patchArticle = async (req, res, next) => {
  try {
    const articleId = req.params.article_id;
    const [, updateArticle] = await Promise.all([
      checkArticleExists(articleId),
      updatedArticle(req.body, +articleId),
    ]);
    res.status(200).send({ updateArticle });
  } catch (err) {
    next(err);
  }
};
