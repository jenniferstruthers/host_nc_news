const { selectTopics, selectArticles, selectArticlebyID, selectComments, insertComment, updateArticle, selectUsers, removeComment, selectEndpoints } = require('../models/models.js');
const endpoints = require(`../endpoints.json`);
exports.getTopics = (req, res) => {
  selectTopics().then(topics => {
    res.status(200).send({topics})
  });
};

exports.getArticles = (req, res,next) => {
  const {topic, sort_by, order} = req.query
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

  exports.deleteComment = (req, res,next) => {
    const comment_id = req.params.comment_id
    removeComment(comment_id).then(comment => {
        res.status(204).send()
    })
    .catch(err =>{
      next(err)
    })}

  exports.getEndpoints = (req, res) => {

      return res.status(200).send({ message: endpoints })
      .catch(err =>{
        next(err)
  })}