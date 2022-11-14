const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics;`).then(topics => {
    return topics.rows
    })
};

exports.selectArticles = (sort_by = "created_at", order = "desc") => {
    return db.query(`SELECT articles.*, 
    COUNT(comments.article_id) ::INT AS comment_count
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};`).then(articles => {
    return articles.rows
    })
};

