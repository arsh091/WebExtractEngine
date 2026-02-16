import request from 'supertest';
import app from '../src/server.js';

describe('API Endpoints', () => {
    test('GET /api/health should return OK', async () => {
        const response = await request(app)
            .get('/api/health')
            .expect(200);

        expect(response.body.status).toBe('OK');
    });

    test('POST /api/extract should handle invalid URL', async () => {
        const response = await request(app)
            .post('/api/extract')
            .send({ url: 'invalid-url' })
            .expect(400);

        expect(response.body.success).toBe(false);
    });
});
