const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const validEndpoints = require('../endpoints.json');

const testData = require('../db/data/test-data/index');

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    return db.end();
});

describe('GET Requests', () => {
    describe('GET API', () => {
        test('/api/healthcheck should return a 200 and a message saying working', () => {
            return request(app)
                .get('/api/healthcheck')
                .expect(200)
                .then(({ body, error }) => {
                    expect(error).toBe(false);
                    expect(body.msg).toBe('working');
                });
        });
        test('/api/notanendpoint should return a 404 if supplies an invalid endpoint', () => {
            return request(app)
                .get('/api/notanendpoint')
                .expect(404)
                .then(({ body, error }) => {
                    expect(error).not.toBe(false);
                    expect(body).toEqual({});
                });
        });
        test('/api should provide a description of other endpoints that are available', () => {
            return request(app)
                .get('/api')
                .expect(200)
                .then(({ body }) => {
                    expect(body.endpoints).toEqual(validEndpoints);
                })
        });
        test('/api object objects should have keys of description, queries (an array of valid queries) and an example response.', () => {
            return request(app)
                .get('/api')
                .expect(200)
                .then(({ body }) => {
                    const { endpoints } = body;
                    for (const key in endpoints) {
                        if (key === 'GET /api') {
                            expect(endpoints[key]).toMatchObject({
                                description: expect.any(String)
                            });
                        } else {
                            expect(endpoints[key]).toMatchObject({
                                description: expect.any(String),
                                queries: expect.any(Array),
                                exampleResponse: expect.any(Object)
                            });
                        }
                    }
                })
        });
    });
    describe('GET /api/topics', () => {
        test('should return a 200 an array of topic objects', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({ body }) => {
                    const { topics } = body
                    expect(topics).toHaveLength(3)
                    topics.forEach((topic) => {
                        expect(topic).toMatchObject({
                            description: expect.any(String),
                            slug: expect.any(String)
                        });
                    });
                });
        });
    });
    describe('GET /api/articles/:article_id', () => {
        test('should return a sigle article with the article_id coresponding to the request.', () => {
            return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(({ body }) => {
                    expect(body.article[0].article_id).toBe(1);
                });
        });
        test('should return 404 if the requested id doesnt match a valid row.', () => {
            return request(app)
                .get('/api/articles/99')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Not Found');
                })
        });
        test('should return 400 if the request id is not a number', () => {
            return request(app)
                .get('/api/articles/blueberrymuffin')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad Request');
                })
        });
    });
    describe('GET /api/articles/:article_id/comments', () => {
        test('should return 200 and return an array of comments for the specified article', () => {
            return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                    const { comments } = body;
                    expect(comments.length).toBe(11);
                    comments.forEach((comment) => {
                        expect(comment).toMatchObject({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                            article_id: 1,
                        });
                    });
                });
        });
        test('should return the comments in date/time order, with the most recent first', () => {
            return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                    const { comments } = body;
                    expect(comments[0]).toMatchObject({
                        comment_id: 5,
                        votes: 0,
                        created_at: '2020-11-03T21:00:00.000Z',
                        author: 'icellusedkars',
                        body: 'I hate streaming noses',
                        article_id: 1
                    });
                });
        });
        test('should return 404 if the requested id does not match a row in the table.', () => {
            return request(app)
                .get('/api/articles/115/comments')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Not Found');
                })
        });
        test('should return an empty array if the id is valid but there are no comments.', () => {
            return request(app)
                .get('/api/articles/giantotter/comments')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad Request');
                })
        });
        test('should return 400 if the requested id is invalid.', () => {
            return request(app)
                .get('/api/articles/2/comments')
                .expect(200)
                .then(({ body }) => {
                    const { comments } = body;
                    expect(comments.length).toBe(0);
                    expect(comments).toEqual([]);
                });
        });
    });
});