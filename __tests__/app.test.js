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