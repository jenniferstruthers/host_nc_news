const { selectTopics, selectArticles, selectArticlebyID, selectComments, insertComment, updateArticle, selectUsers } = require('../models/models.js');

exports.getTopics = (req, res) => {
  selectTopics().then(topics => {
    res.status(200).send({topics})
  });
};

exports.getArticles = (req, res,next) => {
  const topic = req.query.topic
  const sort_by = req.query.sort_by
  const order = req.query.order
  selectArticles(topic,sort_by,order).then(articles => {
    res.status(200).send({articles})
  }).catch(err =>{
    next(err)
  })
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
  insertComment(article_id,username, body).then((comment)=>{
    res.status(201).send({comment})
  })
  .catch(err =>{
    next(err)
  })
};

exports.patchArticle = (req, res, next) => {
  const article_id = req.params.article_id
  const body = req.body
  updateArticle(article_id,body).then(article => {
      res.status(201).send({article})
  })  .catch(err =>{
    next(err)
  })}

  exports.getUsers = (req, res) => {
    selectUsers().then(users => {
      res.status(200).send({users})
    });
  };