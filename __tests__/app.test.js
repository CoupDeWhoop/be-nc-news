const app = require('../app');
const request = require("supertest");
const db = require('../db/connection');
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET /*', () => {
    test('404 path not found', () => {
    return request(app)
    .get("/api/westworld")
    .expect(404)
    .then(({body}) => {
        expect(body.msg).toBe('path not found')

    });

    })
});


describe('GET /api/topics', () => {
    test('200 - responds with array of topics data', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            expect(body.topics).toHaveLength(3)
            body.topics.forEach((topic) => {
                expect(topic.slug).toEqual(expect.any(String));
                expect(topic.description).toEqual(expect.any(String))
            })
          });
    });
});
