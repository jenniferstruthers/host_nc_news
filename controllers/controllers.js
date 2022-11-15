const { selectTopics, selectArticles, selectArticlebyID, selectComments, insertComment } = require('../models/models.js');

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

exports.getComments = (req, res, next) => {
  const {article_id} = req.params
  selectComments(article_id)
  .then(comments => {
    res.status(200).send({comments})
  })
  .catch(err =>{
    next(err)
  })
};

exports.postComment = (req, res, next) => {
  const {article_id} = req.params
  const {username, body} = req.body
  console.log(username, body)

  insertComment(article_id,username, body).then((comment)=>{
    res.status(201).send({comment})
  })
  .catch(err =>{
    next(err)
  })
};