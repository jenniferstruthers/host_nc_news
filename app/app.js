const express = require('express');
const {
  getTopics, getArticles, getArticleByID, getComments, postComment, patchArticle
} = require('../controllers/controllers.js');

const app = express();
app.use(express.json())
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleByID)
app.get('/api/articles/:article_id/comments', getComments)
app.post('/api/articles/:article_id/comments', postComment)
app.patch('/api/articles/:article_id', patchArticle)

app.all('/*', (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400)
    .send({ msg: "invalid article id" })} 
    else next(err)
});

app.use((err, request, response, next) => {
  if (err.code === "23503") {
    response.status(404).send({ msg:"invalid username"});
  } else {
    next(err);
  }
});


app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg })
  } else next(err)
});

app.use((err, req, res, next) => {
  res.sendStatus(500);
});

module.exports = app;
