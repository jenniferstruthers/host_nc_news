const app = require('../app/app.js');
const db = require("../db/connection")
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => {
  if (db.end) db.end();
});

beforeEach(() => {
    return seed(data);
  });

  describe("Error handling", () => {
    test("status:404, responds with a error when passed valid but non-existant endpoint", () => {
      return request(app)
        .get("/api/nonsense")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Route not found");
        });
    });
  });

describe('1. GET /api/topics', () => {
  test('status:200, responds with an array of topics objects, with slug and description properties', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String)
            })
          );
        });
      });
  });
});

describe('2. GET /api/articles', () => {
  test('status:200, responds with an array of article objects, with title, topic, author, body, created_at, comment_count and votes properties ', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy("created_at", {descending: true})
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number)
            })
          );
        });
      });
  });
});

describe('3. GET /api/articles/:article_id', () => {
  test('status:200, responds with an article object, with title, topic, author, body, created_at, and votes properties ', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        const { article} = body;
        expect(article).toBeInstanceOf(Object);
          expect(article).toEqual(
            expect.objectContaining({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100
            })
          );
      });
  });
  test('status:404, valid id not found ', () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('article not found')
      });
  });
  test('status:400, invalid id', () => {
    return request(app)
      .get('/api/articles/nonsense')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request')
      });
  });
});

describe('4. GET /api/articles/:article_id/comments', () => {
  test('status:200, responds with an array of comment objects for a given article', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toBeSortedBy("created_at", {descending: true})
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
            })
          );
        });
      });
  });
  test('status:400, invalid id', () => {
    return request(app)
      .get('/api/articles/nonsense/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request')
      });
  });
  test('status:404, valid id not found ', () => {
    return request(app)
      .get('/api/articles/999/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('article not found')
      });
  });
  test('status:200, but article has no comments', () => {
    return request(app)
      .get('/api/articles/8/comments')
      .expect(200)
      .then(({ body }) => {
      const { comments } = body;
      expect(comments).toHaveLength(0)
      expect(comments).toEqual([])
      });
  });

});

describe('5. POST /api/articles/:article_id/comment', () => {
  test('status:201, responds with the comment', () => {
      const newComment = {
        username: "butter_bridge",
        body: "my great comment"
      }
  return request(app)
  .post('/api/articles/1/comments')
  .send(newComment)
  .expect(201)
  .then((res) => {
      expect(res.body.comment).toMatchObject({
        comment_id: expect.any(Number),
        body: "my great comment",
        votes: 0,
        author: "butter_bridge",
        article_id: 1,
        created_at: expect.any(String)
      })
});
})
test('status:400, when there is no data in the send request', () => {
  const newComment = {}
return request(app)
.post('/api/articles/1/comments')
.send(newComment)
.expect(400)
.then((res) => {
  expect(res.body.msg).toBe("bad request")

});
})
test('status:400, when there is no BODY in the send request', () => {
  const newComment = {username: "butter_bridge"}
return request(app)
.post('/api/articles/1/comments')
.send(newComment)
.expect(400)
.then((res) => {
  expect(res.body.msg).toBe("bad request")

});
})
test('status:400, when there is no USERNAME in the send request', () => {
  const newComment = {body: "bad bad comment"}
return request(app)
.post('/api/articles/1/comments')
.send(newComment)
.expect(400)
.then((res) => {
  expect(res.body.msg).toBe("bad request")

});
})
test('status:404, when there is a valid comment, but article_id doesnt exist', () => {
  const newComment = {username: "butter_bridge", body: "where is the article"}
return request(app)
.post('/api/articles/999/comments')
.send(newComment)
.expect(404)
.then((res) => {
  expect(res.body.msg).toBe('article not found')

});
})
test('status:400, when there is a valid comment, but article_id is invalid', () => {
  const newComment = {username: "butter_bridge", body: "where is the article"}
return request(app)
.post('/api/articles/nonsense/comments')
.send(newComment)
.expect(400)
.then((res) => {
  expect(res.body.msg).toBe('bad request')

});
})
test('status:404, when the username doesnt exist', () => {
  const newComment = {username: "jenjenjen", body: "hahah bad username"}
return request(app)
.post('/api/articles/1/comments')
.send(newComment)
.expect(404)
.then((res) => {
  expect(res.body.msg).toBe('invalid username')

});
})
})

describe('6. PATCH /api/articles/:article_id', () => {
  test('status:201, respond with updated article object', () => {
  const voteChange =  {inc_votes: 1}
  return request(app)
  .patch('/api/articles/1')
  .send(voteChange)
  .expect(201)
  .then((res) =>{
      expect(res.body.article).toMatchObject({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 101
      })
  })
})
test('status:201, respond with updated article object, for negative votes', () => {
  const voteChange =  {inc_votes: -200}
  return request(app)
  .patch('/api/articles/1')
  .send(voteChange)
  .expect(201)
  .then((res) =>{
      expect(res.body.article).toMatchObject({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: -100
      })
  })
})
test('status:404, for when the article does not exist', () => {
  const voteChange =  {inc_votes: -200}
  return request(app)
  .patch('/api/articles/2000')
  .send(voteChange)
  .expect(404)
  .then((res) =>{
    expect(res.body.msg).toBe('article not found')
  })
  
})
test('status:400, for when the article_id is invalid', () => {
  const voteChange =  {inc_votes: 100000}
  return request(app)
  .patch('/api/articles/nonsense')
  .send(voteChange)
  .expect(400)
  .then((res) =>{
    expect(res.body.msg).toBe('bad request')
  })
  
})
test('status:400, for when inc_votes body is incorrect', () => {
  const voteChange =  {inc_votes: "one"}
  return request(app)
  .patch('/api/articles/1')
  .send(voteChange)
  .expect(400)
  .then((res) =>{
    expect(res.body.msg).toBe('bad request')
  })
  
})
})

describe('7. GET /api/users', () => {
  test('status:200, responds with an array of user objects, with name, username and avatar_url properties', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
                name: expect.any(String),
                username: expect.any(String),
                avatar_url: expect.any(String)
            })
          );
        });
      });
  });
});


describe('8. GET /api/articles?topic=input', () => {
  test('status:200, responds with all articles under a certain topic', () => {
    return request(app)
      .get('/api/articles?topic=mitch')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: "mitch",
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number)
            })
          );
        });
      });
  });
  test('status:200, responds with all articles sorted by votes', () => {
    return request(app)
      .get('/api/articles?sort_by=votes')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toBeSortedBy("votes", { descending: true });
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number)
            })
          );
        });
      });
  });
  test('status:200, responds with all articles sorted by date ascending (instead of default desc)', () => {
    return request(app)
      .get('/api/articles?order=asc')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toBeSortedBy("created_at", { descending: false });
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number)
            })
          );
        });
      });
  });
  test('status:200, responds with no articles when given a topic with no articles', () => {
    return request(app)
      .get('/api/articles?topic=paper')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(0)
        expect(articles).toEqual([])
      });
  });
  test('status:404, responds with error when given a non-existant topic', () => {
    return request(app)
      .get('/api/articles?topic=jenjenjen')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "topic not found"
        );
      });
  });
  test("status:400: responds with an error when passed an invalid sort_by", () => {
    return request(app)
      .get("/api/articles?sort_by=nonsense")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request: please sort by one of the following: created_at, votes, title, topic, body');
      });
  });
  test("status:400: responds with an error when passed an invalid order ", () => {
    return request(app)
      .get("/api/articles?order=nonsense")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request: please sort by "asc" or "desc"');
      });
  });
});