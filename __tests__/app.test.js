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
                expect(body.article).toEqual(
                    expect.objectContaining({
                        article_id: 4,
                        title: 'Student SUES Mitch!',
                        topic: 'mitch',
                        author: 'rogersop',
                        body: 'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
                        created_at: '2020-05-06T01:14:00.000Z',
                        votes: 0,
                        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                    })
                )
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
                expect(body.msg).toBe('invalid request')
            })
        })
    });

    describe('GET /api/articles', () => {
        test('status 200 - should respond with array of articles, sorted by date in descending order.', () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toHaveLength(13)
                body.articles.forEach((article) => {
                    expect(article).toHaveProperty("author", expect.any(String))
                    expect(article).toHaveProperty("title", expect.any(String))
                    expect(article).toHaveProperty("article_id", expect.any(Number))
                    expect(article).not.toHaveProperty("body")
                    expect(article).toHaveProperty("topic", expect.any(String))
                    expect(article).toHaveProperty("created_at", expect.any(String))
                    expect(article).toHaveProperty("votes", expect.any(Number))
                    expect(article).toHaveProperty("article_img_url", expect.any(String))
                    expect(article).toHaveProperty("comment_count", expect.any(Number))
                }) 
                expect(body.articles).toBeSorted({ key: "created_at", descending: true })
            })
        });
    });

    describe('Get /api/articles/:article_id/comments', () => {
        test('200 - responds with array of comments for the given article_id', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({body}) => {
                expect(body.comments).toHaveLength(11)
                body.comments.forEach((comment) => {
                    expect(comment).toHaveProperty("comment_id", expect.any(Number))
                    expect(comment).toHaveProperty("votes", expect.any(Number))
                    expect(comment).toHaveProperty("created_at", expect.any(String))
                    expect(comment).toHaveProperty("author", expect.any(String))
                    expect(comment).toHaveProperty("body", expect.any(String))
                    expect(comment).toHaveProperty("article_id", expect.any(Number))
                }) 
                expect(body.comments).toBeSorted({ key: "created_at", descending: true })
            })
        })
        test('404 - article_id not found ', () => {
            return request(app)
            .get('/api/articles/999/comments')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('article_id not found')
            })
        })
        test('400 - bad request', () => {
            return request(app)
            .get('/api/articles/itchy/comments')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('invalid request')
            })
        })
    });
});
