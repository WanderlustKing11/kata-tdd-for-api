
import request from 'supertest';
import app from '../src/app';


describe('GET /tasks/:id', () => {
    it('should return a task when given a valid id', async () => {
        const newTask = { title: 'Task for GET by ID' };
        const postResponse = await request(app)
            .post('/tasks')
            .send(newTask)
            .set('Accept', 'application/json');

        const taskId = postResponse.body.id;

        const getResponse = await request(app).get(`/tasks/${taskId}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toHaveProperty('id', taskId);
        expect(getResponse.body).toHaveProperty('title', newTask.title);
    });

    it('should return 400 for an invalid (non-numeric) id', async () => {
        const response = await request(app).get('/tasks/not-a-number');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid task id');
    });

    it('should return 404 when no task exists with the given id', async () => {
        const response = await request(app).get('/tasks/9999');  // assuming 9999 doesn't exist
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Task not found');
    });
});

