const db = require('../db/connection');
const { checkArticleExists } = require('../db/db.js');

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

exports.selectArticlebyID = (article_id) => {
    return checkArticleExists(article_id).then(()=>{
        return db.query(`SELECT * FROM articles 
        WHERE article_id = $1;`, [article_id])
        .then((article) => {
        return article.rows[0]
        })
    })
}




