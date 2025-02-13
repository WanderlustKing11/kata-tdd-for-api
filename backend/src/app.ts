import express, { Request, Response } from 'express';
import { tasks, addTask } from './tasks';

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.get('/tasks', (req: Request, res: Response) => {
  res.status(200).json(tasks);
});

app.post('/tasks', (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }
  const newTask = addTask(title);
  res.status(201).json(newTask);
});

// New: GET /tasks/:id endpoint
app.get('/tasks/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid task id' });
    return;
  }

  const task = tasks.find(task => task.id === id);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  res.status(200).json(task);
});

export default app;
