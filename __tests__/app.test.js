const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');

const testData = require('../db/data/test-data/index');

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    return db.end();
});

describe('GET Requests', () => {
    describe('GET API', () => {
        test('should return a 200 and a message saying working', () => {
            return request(app)
                .get('/api/healthcheck')
                .expect(200)
                .then(({ body, error }) => {
                    expect(error).toBe(false);
                    expect(body.msg).toBe('working');
                });
        });
        test('should return a 404 if supplies an invalid endpoint', () => {
            return request(app)
                .get('/api/notanendpoint')
                .expect(404)
                .then(({ body, error }) => {
                    expect(error).not.toBe(false);
                    expect(body).toEqual({});
                });
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
});