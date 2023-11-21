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

    describe('GET /api/articles', () => {
        test('should return 200 and an array containing all of the articles', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body;
                    expect(articles.length).toBe(13);
                    articles.forEach((article) => {
                        expect(article).toMatchObject({
                            author: expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            article_img_url: expect.any(String),
                            comment_count: expect.any(Number),
                        });
                    });
                })
        });
        test('should return the articles in descending order by date', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles[0]).toMatchObject({
                        author: 'icellusedkars',
                        title: 'Eight pug gifs that remind me of mitch',
                        article_id: 3,
                        topic: 'mitch',
                        created_at: '2020-11-03T09:12:00.000Z',
                        votes: 0,
                        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                        comment_count: 2
                    })
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