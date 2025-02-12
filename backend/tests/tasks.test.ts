
import request from 'supertest';
import app from '../src/app';


describe('GET /tasks', () => {
    it('should return an empty array when no tasks exist', async () => {
        const response = await request(app).get('/tasks');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});

