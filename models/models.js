const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics;`).then(topics => {
    return topics.rows
    })
};

exports.selectArticles = () => {
    return db.query(`SELECT * FROM articles;`).then(articles => {
    return articles.rows
    })
};

