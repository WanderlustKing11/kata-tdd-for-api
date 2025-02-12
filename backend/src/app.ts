
import express, { Request, Response } from 'express';
import { tasks } from './tasks';

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.get('/tasks', (req: Request, res: Response) => {
  res.status(200).json(tasks);
});

export default app;
