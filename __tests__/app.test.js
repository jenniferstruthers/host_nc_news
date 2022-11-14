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