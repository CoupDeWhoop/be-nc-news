const app = require('../app');
const request = require("supertest");
const db = require('../db/connection');
const format = require('pg-format');
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

    describe("GET /api/users", () => {
        test('200 - should respond with an array of user objects', () => {
            return request(app)
            .get("/api/users")
            .expect(200)
            .then(({body}) => {
                expect(body.users).toHaveLength(4)
                body.users.forEach((user) => {
                    expect(user).toHaveProperty("username", expect.any(String))
                    expect(user).toHaveProperty("name", expect.any(String))
                    expect(user).toHaveProperty("avatar_url", expect.any(String))
                }) 
            })
        });
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
                expect(body.msg).toBe('Article 49 not found')
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
        test('200 - should respond with array of articles, sorted by date in descending order.', () => {
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
        test('200 - articles endpoint should accept a topic query, filtering by specified value', () => {
            return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toHaveLength(12)
                body.articles.forEach((article) => {
                    expect(article).toHaveProperty("topic", 'mitch')
                    expect(article).toHaveProperty("author", expect.any(String))
                    expect(article).toHaveProperty("title", expect.any(String))
                    expect(article).toHaveProperty("article_id", expect.any(Number))
                    expect(article).not.toHaveProperty("body")
                    expect(article).toHaveProperty("created_at", expect.any(String))
                    expect(article).toHaveProperty("votes", expect.any(Number))
                    expect(article).toHaveProperty("article_img_url", expect.any(String))
                    expect(article).toHaveProperty("comment_count", expect.any(Number))
                }) 
                expect(body.articles).toBeSorted({ key: "created_at", descending: true })
            })
        })
        test('200 - topic query does not match any articles', () => {
            return request(app)
            .get("/api/articles?topic=trombone")
            .expect(200)
            .then(({ body }) => {
                expect(body.msg).toBe('topic not found')
            })
        })
    });

    describe('GET /api/articles/:article_id/comments', () => {
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
                    expect(comment).toHaveProperty("article_id", 1)
                }) 
                expect(body.comments).toBeSorted({ key: "created_at", descending: true })
            })
        })
        test('200 - responds with message when given article_id valid but has no comments', () => {
            return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then(({body}) => {
                expect(body.msg).toBe('Article 2 has no comments')
            })
        });
        test('404 - article_id not found ', () => {
            return request(app)
            .get('/api/articles/999/comments')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Article 999 not found')
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

describe('POST', () => {
    
    describe('POST /api/articles/:article_id/comments', () => {
        
        test('201 - responds with the posted comment', () => {
            const newComment = {body: 'Wonderful, simply wonderful', username: 'rogersop'}
            return request(app)
            .post('/api/articles/2/comments')
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                expect(body.comment).toMatchObject({
                    comment_id: 19,
                    body: 'Wonderful, simply wonderful',
                    article_id: 2,
                    author: 'rogersop',
                    votes: 0,
                    created_at: expect.any(String)
                })
            })
        });
        test('404 - article_id not found', () => {
            const newComment = {body: 'Wonderful, simply wonderful', username: 'rogersop'}
            return request(app)
            .post('/api/articles/999/comments')
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('provided key not found')
            })
        });
        test('404 - user not found', () => {
            const newComment = {body: 'Wonderful, simply wonderful', username: 'unknownUser'}
            return request(app)
            .post('/api/articles/2/comments')
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('provided key not found')
            })
        });
        test('400 - comment body not provided', () => {
            const malformed = {username: 'rogersop'}
            return request(app)
            .post('/api/articles/2/comments')
            .send(malformed)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('invalid request')
            })
        })
        test('400 - comment username not provided', () => {
            const malformed2 = {body: 'Great stuff'}
            return request(app)
            .post('/api/articles/2/comments')
            .send(malformed2)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('invalid request')
            })
        })

    })
});

describe('PATCH', () => {

    describe('PATCH /api/articles/:article_id', () => {
        test('200 - responds with the article votes updated correctly', () => {
            const patchInput = { inc_votes : 20 };

            return request(app)
                .patch('/api/articles/6')
                .send(patchInput)
                .expect(200)
                .then(({body}) => {
                    const articleObj = {
                            article_id: 6,
                            title: 'A',
                            topic: 'mitch',
                            author: 'icellusedkars',
                            body: 'Delicious tin of cat food',
                            created_at: '2020-10-18T01:00:00.000Z',
                            votes: 20,
                            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                    }
                    expect(body.article).toMatchObject(articleObj)
                })
        });
        test('200 - decrements votes for the article correctly', () => {
            const patchInput = { inc_votes : -20 };

            return request(app)
                .patch('/api/articles/6')
                .send(patchInput)
                .expect(200)
                .then(({body}) => {
                    const articleObj = {
                            article_id: 6,
                            title: 'A',
                            topic: 'mitch',
                            author: 'icellusedkars',
                            body: 'Delicious tin of cat food',
                            created_at: '2020-10-18T01:00:00.000Z',
                            votes: -20,
                            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                    }
                    expect(body.article).toMatchObject(articleObj)
                })
        });
        test("200 - article_id doesn't exist", () => {
            const patchInput2 = { inc_votes : 20 };
            return request(app)
                .patch('/api/articles/999')
                .send(patchInput2)
                .expect(200)
                .then(({body}) => {
                    expect(body.msg).toBe('Article 999 not found')
                })
        });
        test('200 - original article returned when no request body provided.', () => {
            return request(app)
            .patch('/api/articles/6')
            .send({})
            .expect(200)
            .then(({body}) => {
                const articleObj = {
                        article_id: 6,
                        title: 'A',
                        topic: 'mitch',
                        author: 'icellusedkars',
                        body: 'Delicious tin of cat food',
                        created_at: '2020-10-18T01:00:00.000Z',
                        votes: 0,
                        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                }
                expect(body.article).toMatchObject(articleObj)
            })
        });
        test('400 - invalid input', () => {
            const patchInput2 = { inc_votes : "cat" };
            return request(app)
                .patch('/api/articles/6')
                .send(patchInput2)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('invalid request')
                })
        })
        test("400 - article_id invalid", () => {
            const patchInput2 = { inc_votes : 20 };
            return request(app)
                .patch('/api/articles/cat')
                .send(patchInput2)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('invalid request')
                })
        });
    });
});

describe('DELETE', () => {
    
    describe('DELETE /api/comments/:comment_id', () => {
        test('204 - should delete a comment with the given comment id,', () => {
            return request(app)
            .delete('/api/comments/1')
            .expect(204)
            .then(({ body }) => {
                expect(!body)
            })
        });
        test('404 - should return an error if the provided comment_id is invalid', () => {
            return request(app)
            .delete('/api/comments/35')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Comment does not exist")
            })
        });
        test('400 - should return error if comment_id invalid', () => {
            return request(app)
            .delete('/api/comments/tired')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("invalid request")
            })
        });
    });
});

