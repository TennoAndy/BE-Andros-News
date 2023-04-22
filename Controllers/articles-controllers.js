const { selectArticleById } = require("../models/articles-models");

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  selectArticleById(+articleId).then(( selectArticle ) => {
    return res.status(200).send({ selectArticle });
  });
};
