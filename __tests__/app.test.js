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
                    const endpointKeys = Object.keys(body.endpoints);
                    expect(endpointKeys.includes('GET /api')).toBe(true);
                    expect(endpointKeys.includes('GET /api/topics')).toBe(true);
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
});