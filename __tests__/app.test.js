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
                .then(({ body }) => {
                    expect(body.msg).toBe('working');
                })
        });
    });
});