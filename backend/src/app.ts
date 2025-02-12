
import express, { Request, Response, RequestHandler } from 'express';
import { tasks, addTask } from './tasks';


const app = express();
app.use(express.json());



const createTask: RequestHandler = (req, res) => {
  const { title } = req.body;
  if (!title) {
    res.status(400).json({ error: 'Title is required ' });
    return;
  }

  const newTask = addTask(title);
  res.status(201).json(newTask);
}



app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.get('/tasks', (req: Request, res: Response) => {
  res.status(200).json(tasks);
});

app.post('/tasks', createTask);


export default app;
