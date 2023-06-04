const {
  selectArticleById,
  selectArticles,
  updateArticleById,
  checkArticleExists,
  insertArticle,
  deleteArticleById,
} = require("../models/articles-models");

const { checkTopicExists } = require("../models/topics-models");

// exports.getArticleById = (req, res, next) => {
//   const articleId = req.params.article_id;
//   selectArticleById(+articleId)
//     .then((article) => res.status(200).send({ article }))
//     .catch(next);
// };

exports.getArticleById = async (req, res, next) => {
  try {
    const articleId = req.params.article_id;
    const article = await selectArticleById(articleId);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  try {
    const { topic, sort_by, order } = req.query;
    const [, articles] = await Promise.all([
      checkTopicExists(topic),
      selectArticles(topic, sort_by, order),
    ]);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.patchArticleById = async (req, res, next) => {
  try {
    const articleId = req.params.article_id;
    const [, updateArticle] = await Promise.all([
      checkArticleExists(articleId),
      updateArticleById(req.body, articleId),
    ]);
    res.status(200).send({ updateArticle });
  } catch (err) {
    next(err);
  }
};

exports.postArticle = async (req, res, next) => {
  try {
    const article = req.body;
    const newArticle = await insertArticle(article);
    res.status(201).send({ newArticle });
  } catch (err) {
    next(err);
  }
};

exports.deleteArticleById = async (req, res, next) => {
  try {
    const deleteId = req.params.article_id;
    const deleteArticle = await deleteArticleById(deleteId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
