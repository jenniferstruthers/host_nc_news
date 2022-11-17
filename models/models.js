const db = require('../db/connection');
const { checkArticleExists } = require('../db/db.js');

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics;`).then(topics => {
    return topics.rows
    })
};

exports.selectArticles = (topic, sort_by = "created_at", order = "desc") => {
    return this.selectTopics().then((topics)=>{
        let topicsArray = []
        topics.forEach((topic)=>{
            topicsArray.push(topic.slug)
        })
        if (topic && !topicsArray.includes(topic)){
            return Promise.reject({status:404,msg:'topic not found'})
        }
        if(order!== 'asc' && order!== 'desc'){
            return Promise.reject({status:400,msg:'bad request: please sort by "asc" or "desc"'})
        }
        const validSortBys = ['created_at', 'votes', 'title', 'topic', 'body']
        if(!validSortBys.includes(sort_by)){
            return Promise.reject({status:400,msg:'bad request: please sort by one of the following: created_at, votes, title, topic, body'})
        }

        let queryArray = []
        let queryString = `SELECT articles.*, 
        COUNT(comments.article_id) ::INT AS comment_count
        FROM articles 
        LEFT JOIN comments ON comments.article_id = articles.article_id`;
        if (topic){
            queryString += ` WHERE topic=$1`;
            queryArray.push(topic)
        }
        queryString += ` GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order};`
    
        return db.query(queryString, queryArray).then(articles => {
        return articles.rows
        })
    })
};

exports.selectArticlebyID = (article_id) => {
    return db.query(`SELECT * FROM articles 
        WHERE article_id = $1;`, [article_id])
        .then((res) => {
            if(res.rows.length === 0){
                return Promise.reject({status:404,msg:'article not found'})
            }
        return res.rows[0]
        })
}


exports.selectComments = (article_id, sort_by = "created_at", order = "desc") => {
    return checkArticleExists(article_id).then(()=>{
        return db.query(`SELECT * FROM comments 
        WHERE article_id = $1
        ORDER BY ${sort_by} ${order};`, [article_id])
        .then((res) => {
        return res.rows
        })
    })

}

exports.insertComment = (article_id,username,body) => {
    return checkArticleExists(article_id).then(()=>{
    if (username === undefined || body === undefined) {
        return Promise.reject({status:400, msg:'bad request'})}
    return db.query(`
    INSERT INTO comments
    (article_id, author, body)
    VALUES
    ($1, $2, $3)
    RETURNING *;`,
    [article_id, username, body])

    .then(comment => {
    return comment.rows[0]
    })
})
};

exports.updateArticle = (article_id,body) => {
    return checkArticleExists(article_id).then(()=>{
    return db.query(`UPDATE articles SET votes = votes + $1  WHERE article_id = $2 RETURNING *`, 
    [body.inc_votes, article_id]).then((article) => {
        return article.rows[0]
    })
})
}

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users;`).then(users => {
    return users.rows
    })
};
