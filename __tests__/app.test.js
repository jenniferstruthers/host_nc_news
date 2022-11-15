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
        expect(body.msg).toBe('invalid article id')
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
        expect(body.msg).toBe('invalid article id')
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

});
