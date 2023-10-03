const app = require('../app');
const request = require("supertest");
const db = require('../db/connection');
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const endpointsCopy = require('../endpoints.json')


beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET requests', () => {
    
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

    describe("GET /api", () => {
        test("Status: 200 - Should respond with a JSON object that describes all of the availlable endpoints", () => {
            return request(app)
            .get("/api")
            .expect(200)
            .then(({body}) => {
                const {endpoints} = body;
                expect(endpoints).toEqual(endpointsCopy)
            })
        })
    })

    describe('GET /api/articles/:article_id', () => {
        test('200 - should respond with an object containing the correct properties', () => {
            return request(app)
            .get("/api/articles/4")
            .expect(200)
            .then(({body}) => {
                expect(typeof body.article).toBe('object');
                expect(body.article).toHaveProperty("author", expect.any(String))
                expect(body.article).toHaveProperty("title", expect.any(String))
                expect(body.article).toHaveProperty("article_id", expect.any(Number))
                expect(body.article).toHaveProperty("body", expect.any(String))
                expect(body.article).toHaveProperty("topic", expect.any(String))
                expect(body.article).toHaveProperty("created_at", expect.any(String))
                expect(body.article).toHaveProperty("votes", expect.any(Number))
                expect(body.article).toHaveProperty("article_img_url", expect.any(String))
            })
        });
        test('status 404 - article not found', () => {
            return request(app)
            .get("/api/articles/49")
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('No articles found for article_id: 49')
            })
        });
        test('status 400 - article_id is a number', () => {
            return request(app)
            .get("/api/articles/steps_greatest_hits")
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Article id should be a number')
            })
        })
    });

});
