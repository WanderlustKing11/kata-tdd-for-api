
# My Task Manager Kata Manual

A simple Task Manager project built as a learning exercise to improve my skills in TypeScript, Express, and React. The project emphasizes Test-Driven Development (TDD), small incremental steps, and a clean, repeatable structure using an in-memory data store.

---

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Repository & Directory Structure](#repository--directory-structure)  
3. [Initial Setup & Dependencies](#initial-setup--dependencies)  
4. [Backend Setup & TDD Workflow](#backend-setup--tdd-workflow)  
    - [Setting Up the Backend](#setting-up-the-backend)  
    - [Writing Tests First](#writing-tests-first)  
    - [Implementing Endpoints](#implementing-endpoints)  
5. [Frontend Setup & Integration](#frontend-setup--integration)  
6. [Running the Project](#running-the-project)  
7. [Restarting the Project (Kata Reset)](#restarting-the-project-kata-reset)  
8. [Troubleshooting & Common Pitfalls](#troubleshooting--common-pitfalls)  
9. [Contributing & Further Enhancements](#contributing--further-enhancements)

---

## Project Overview

- **Purpose:**  
  Build and rebuild a simple task manager daily to develop muscle memory and deepen understanding of full-stack development using TypeScript, Express, and React.

- **Key Concepts:**  
  - Test-Driven Development (TDD)  
  - Incremental, repeatable practice  
  - Clean project structure and dependency management  
  - Hands-on experience with in-memory data management (later expandable)

---

## Repository & Directory Structure

Use a single GitHub repository (e.g., `my-task-manager`) for your project. The recommended structure is as follows:

```
my-task-manager/
├── backend/              # Express API using TypeScript
│   ├── src/
│   │   ├── app.ts      // Express app with all routes defined
│   │   ├── index.ts    // Server startup (imports app from app.ts)
│   │   ├── tasks.ts    // In-memory tasks store and helper functions
│   ├── tests/            # Jest tests for API endpoints
│   ├── package.json      # Backend dependencies and scripts
│   └── tsconfig.json     # TypeScript configuration for the backend
├── frontend/             # React app built with Vite and TypeScript
│   ├── src/
│   │   ├── App.tsx     // Main React component
│   ├── package.json      # Frontend dependencies and scripts
│   └── tsconfig*.json    # TypeScript configuration for the frontend (may include multiple files)
└── MANUAL.md             # This manual
```

*Note:* When you restart your project (your Kata reset), you can delete or clear the `backend/src` and `frontend/src` folders (or the entire repo contents) while keeping the overall structure and the `MANUAL.md` as your reference. You’ll reinstall dependencies every time.

---

## Initial Setup & Dependencies

### Cloning the Repository

If you’re using the same repo for each practice session, clone it once:

```bash
git clone https://github.com/yourusername/my-task-manager.git
cd my-task-manager
```

### Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   The key dependencies include:
   - **Express**
   - **CORS**
   - **TypeScript, ts-node, nodemon**
   - **Jest, ts-jest, Supertest** (for testing)
   - Type definitions for Node, Express, CORS, Jest, and Supertest

3. **Ensure your `tsconfig.json` and `jest.config.js` are configured.**

   Example `tsconfig.json` (in `backend`):

   ```json
   {
     "compilerOptions": {
       "target": "ES6",
       "module": "commonjs",
       "outDir": "dist",
       "rootDir": "src",
       "strict": true,
       "esModuleInterop": true
     },
     "include": ["src", "tests"]
   }
   ```

   Example `jest.config.js`:

   ```js
   /** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
   module.exports = {
     preset: 'ts-jest',
     testEnvironment: 'node',
     testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)']
   };
   ```

### Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   The frontend uses Vite with React and TypeScript.

3. **Your Vite app is already configured with a basic template.**

---

## Backend Setup & TDD Workflow

### Setting Up the Backend

Your backend consists of three main files in the `src` folder:

- **app.ts**  
  Contains your Express app and route definitions (GET, POST, GET by ID, etc.).

- **index.ts**  
  Imports the app from `app.ts` and starts the server when run directly.

- **tasks.ts**  
  Manages your in-memory tasks array and helper functions.

#### Example Code for Backend Files

**src/app.ts**

```typescript
import express, { Request, Response } from 'express';
import { tasks, addTask } from './tasks';
import cors from 'cors';

const app = express();

app.use(cors());
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

// GET /tasks/:id endpoint
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
```

**src/index.ts**

```typescript
import app from './app';

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
```

**src/tasks.ts**

```typescript
export interface Task {
  id: number;
  title: string;
}

// In-memory tasks store
export const tasks: Task[] = [];

// Variable to keep track of the next task id
let nextId = 1;

// Helper function to add a task
export const addTask = (title: string): Task => {
  const newTask: Task = { id: nextId++, title };
  tasks.push(newTask);
  return newTask;
};
```

### Writing Tests First

In your backend, use Jest and Supertest for TDD. Create your test file in the `tests` folder.

**tests/tasks.test.ts**

```typescript
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
    const response = await request(app).get('/tasks/9999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Task not found');
  });
});
```

*Run your tests with:*

```bash
npx jest
```

### Implementing Endpoints

Work incrementally—first write the failing tests, then implement each endpoint in your `app.ts` until the tests pass. Remember to maintain consistent return types (use `res.status(...).json(...)` and then `return;` where necessary).

---

## Frontend Setup & Integration

Your frontend (in the `frontend` folder) is built with Vite and React. The main file is `src/App.tsx`.

**src/App.tsx**

```tsx
import React, { useEffect, useState, FormEvent } from 'react';

interface Task {
  id: number;
  title: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = 'http://localhost:3000'; // Express API URL

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/tasks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch(`${backendUrl}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTaskTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      const addedTask: Task = await response.json();
      setTasks((prevTasks) => [...prevTasks, addedTask]);
      setNewTaskTitle('');
    } catch (err: any) {
      setError(err.message || 'An error occurred while adding task');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Task Manager</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="New task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {task.id}: {task.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
```

Your `frontend/index.html` and other Vite configuration files can remain as provided by the template.

---

## Running the Project

### Starting the Backend

1. Open a terminal and navigate to the `backend` directory:

   ```bash
   cd backend
   npm run dev
   ```

2. You should see a message such as:

   ```
   Server is running on http://localhost:3000
   ```

3. Test by visiting [http://localhost:3000](http://localhost:3000) (should display "Hello, world!") or [http://localhost:3000/tasks](http://localhost:3000/tasks) (should show an empty array or your tasks).

### Starting the Frontend

1. Open another terminal and navigate to the `frontend` directory:

   ```bash
   cd frontend
   npm run dev
   ```

2. Open your browser at the URL provided by Vite (typically [http://localhost:5173](http://localhost:5173)).

3. You should see the Task Manager interface. Initially, it will load tasks (empty array) and allow you to add new tasks.

---

## Restarting the Project (Kata Reset)

When you want to practice rebuilding from scratch:

1. **Option A: Clear the Code Files**
   - Delete all files inside the `backend/src` and `frontend/src` folders (or move them to a backup folder).
   - Keep the repository structure and configuration files (like `package.json`, `tsconfig.json`, and this `MANUAL.md`).
   - Rebuild the source files by following the manual step-by-step.

2. **Option B: Start Fresh in the Same Repo**
   - If desired, you can delete the entire repository content (including the Git directory) and reinitialize it.
   - *Tip:* Many developers prefer to keep the repo and just commit a “kata reset” so they can track their progress over time.

Reinstall dependencies if needed:

```bash
npm install
```

Then follow the manual from the beginning to recreate your project structure, setup, and code.

---

## Troubleshooting & Common Pitfalls

- **CORS Issues:**  
  Ensure you include `app.use(cors())` in your backend before defining routes.

- **TypeScript Return Types in Express Handlers:**  
  Always send the response (using `res.status(...).json(...)`) and then use `return;` to avoid mixed return types.

- **Duplicate Files:**  
  Use a consolidated approach: keep `app.ts` for route definitions and `index.ts` solely for starting the server.

- **Test Failures:**  
  Run tests frequently with `npx jest` to catch errors early. Verify that your endpoints behave as expected.

- **Environment Mismatch:**  
  Confirm that the frontend’s API URL (`http://localhost:3000`) matches your backend’s running address.

---

## Contributing & Further Enhancements

- **Contributions:**  
  Feel free to fork and modify the project. Improvements to testing, error handling, or adding new features are welcome.

- **Next Steps:**  
  Once you’re comfortable with the basics, consider:
  - Adding a database layer (like MySQL) to replace the in-memory store.
  - Enhancing the UI with additional features.
  - Exploring more advanced TDD patterns.

---

*By practicing this Kata repeatedly and following the manual, you will build the muscle memory and understanding necessary for a robust full-stack development workflow.*

Happy coding and enjoy your practice!

---

Feel free to adjust or expand your practice as you gain more experience, and watch this project develope over time. This document is your living guide for mastering the fundamentals through repetition.