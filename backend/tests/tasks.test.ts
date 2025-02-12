
import request from 'supertest';
import express, { Application } from 'express';

const app: Application = express();
app.use(express.json());

app.get('/tasks', (req, res) => {
    res.status(500).send();
});

describe('GET /tasks', () => {
    it('should return an empty array when no tasks exist', async () => {
        const response = await request(app).get('/tasks');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});

