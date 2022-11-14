const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics;`).then(topics => {
    return topics.rows
    })
};

exports.selectArticles = (sort_by = "created_at", order = "desc") => {
    return db.query(`SELECT * FROM articles
                    ORDER BY ${sort_by} ${order};`).then(articles => {
    return articles.rows
    })
};

