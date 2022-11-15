const express = require('express');
const {
  getTopics, getArticles
} = require('../controllers/controllers.js');

const app = express();

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles)

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

module.exports = app;
