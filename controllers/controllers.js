const { selectTopics, selectArticles, selectArticlebyID } = require('../models/models.js');

exports.getTopics = (req, res) => {
  selectTopics().then(topics => {
    res.status(200).send({topics})
  });
};

exports.getArticles = (req, res) => {
  selectArticles().then(articles => {
    res.status(200).send({articles})
  });
};

exports.getArticleByID = (req, res, next) => {
  const {article_id} = req.params
  selectArticlebyID(article_id)
  .then(article => {
    res.status(200).send({article})
  })
  .catch(err =>{
    next(err)
  })
};