
import request from 'supertest';
import app from '../src/app';


describe('POST /tasks', () => {
    it('should create a new task when valid data is provided', async () => {
        const newTask = { title: 'Test Task' };
        const response = await request(app)
            .post('/tasks')
            .send(newTask)
            .set('Accept', 'application/json');

        expect(response.status).toBe(201);
        // Expect the response body to contain an auto-generated id and the title we sent
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newTask.title);
    });
});

