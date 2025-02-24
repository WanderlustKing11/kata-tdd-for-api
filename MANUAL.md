
# My Task Manager Kata Manual – TDD Edition

A simple Task Manager project built as a learning exercise using TypeScript, Express, and React. This manual is designed to be used as a daily Kata exercise. Each time you rebuild this project from scratch, follow these steps to practice Test-Driven Development (TDD) from dependency installation to writing tests and then implementing the code to pass them.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Repository & Directory Structure](#repository--directory-structure)
3. [Initial Setup: Creating the Project from Scratch](#initial-setup-creating-the-project-from-scratch)
    - [Git Repository & Directory Creation](#git-repository--directory-creation)
4. [Backend Setup & Dependency Installation](#backend-setup--dependency-installation)
5. [Frontend Setup & Dependency Installation](#frontend-setup--dependency-installation)
6. [TDD Workflow for the Backend](#tdd-workflow-for-the-backend)
    - [Feature 1: GET /tasks Endpoint](#feature-1-get-tasks-endpoint)
    - [Feature 2: POST /tasks Endpoint](#feature-2-post-tasks-endpoint)
    - [Feature 3: GET /tasks/:id Endpoint](#feature-3-get-tasksid-endpoint)
7. [Frontend Integration & TDD (Manual, Not Full TDD)](#frontend-integration--tdd-manual)
8. [Running the Project](#running-the-project)
9. [Restarting the Project (Kata Reset)](#restarting-the-project-kata-reset)
10. [Troubleshooting & Common Pitfalls](#troubleshooting--common-pitfalls)
11. [Contributing & Further Enhancements](#contributing--further-enhancements)

---

## 1. Project Overview

- **Purpose:**  
  To practice full-stack development with a focus on Test-Driven Development (TDD). The idea is to rebuild this Task Manager project from scratch every time you practice so that you internalize both the technical details and the TDD process.

- **Key Concepts:**  
  - Manual dependency installation (you type each command)
  - Writing a failing test first (red test)
  - Implementing just enough code to pass the test
  - Refactoring and ensuring consistency
  - Repeating the process for each new feature

---

## 2. Repository & Directory Structure

Your project repository (e.g., `my-task-manager`) will have the following structure:

```
my-task-manager/
├── backend/
│   ├── src/
│   │   ├── app.ts       // Express app with route definitions
│   │   ├── index.ts     // Server startup file (imports app.ts)
│   │   ├── tasks.ts     // In-memory tasks store and helper functions
│   ├── tests/           // Jest tests for API endpoints
│   ├── package.json     // Backend dependencies and scripts
│   └── tsconfig.json    // TypeScript configuration for backend
├── frontend/
│   ├── src/
│   │   ├── App.tsx      // Main React component
│   ├── package.json     // Frontend dependencies and scripts
│   └── tsconfig*.json   // TypeScript configuration for frontend
└── MANUAL.md            // This manual
```

*Note:* When you “reset” or restart the project as part of your daily practice, you may delete the contents of `backend/src` and `frontend/src` (or even the entire repo) and rebuild everything manually using this guide.

---

## 3. Initial Setup: Creating the Project from Scratch

### Git Repository & Directory Creation

1. **Create a new folder for your project:**

   ```bash
   mkdir my-task-manager
   cd my-task-manager
   ```

2. **Initialize a Git repository:**

   ```bash
   git init
   ```

3. **Create the necessary directories:**

   ```bash
   mkdir backend frontend
   cd backend
   mkdir src tests
   cd ..
   ```

---

## 4. Backend Setup & Dependency Installation

Navigate to the `backend` directory and perform the following steps manually:

1. **Initialize a new npm project:**

   ```bash
   cd backend
   npm init -y
   ```

2. **Install production dependencies:**

   ```bash
   npm install express cors
   ```

3. **Install development dependencies:**

   ```bash
   npm install --save-dev typescript ts-node nodemon jest ts-jest supertest @types/node @types/express @types/cors @types/jest @types/supertest
   ```

4. **Create `tsconfig.json`:**

   Create a file named `tsconfig.json` with this content:

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

5. **Create `jest.config.js`:**

   Create `jest.config.js` with:

   ```js
   /** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
   module.exports = {
     preset: 'ts-jest',
     testEnvironment: 'node',
     testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)']
   };
   ```

6. **Update the `package.json` scripts:**

   Edit the `package.json` file to add:

   ```json
   "scripts": {
     "start": "node dist/index.js",
     "dev": "nodemon --watch src/**/*.ts --exec ts-node src/index.ts",
     "test": "jest"
   }
   ```

---

## 5. Frontend Setup & Dependency Installation

Navigate to the `frontend` directory and perform the following steps:

1. **Create a new Vite project with React and TypeScript:**

   ```bash
   cd ../frontend
   npm create vite@latest . --template react-ts
   ```

2. **Install frontend dependencies:**

   ```bash
   npm install
   ```

Now your frontend is ready with the basic Vite structure.

---

## 6. TDD Workflow for the Backend

For each feature, follow these three steps: write a failing test, implement the code, then refactor if needed.

### Feature 1: GET /tasks Endpoint

#### Step 1: Write the Failing Test

1. **Create the test file:**

   Create `backend/tests/tasks.test.ts` (if it doesn’t already exist).

2. **Write a test for GET /tasks:**

   Add the following test code:

   ```typescript
   // backend/tests/tasks.test.ts
   import request from 'supertest';
   import app from '../src/app';

   describe('GET /tasks', () => {
     it('should return an empty array when no tasks exist', async () => {
       const response = await request(app).get('/tasks');
       expect(response.status).toBe(200);
       expect(response.body).toEqual([]);
     });
   });
   ```

3. **Run the test:**

   ```bash
   npm run test
   ```

   The test should fail (red) because you haven’t implemented the endpoint yet.

#### Step 2: Implement the Minimal Code

1. **Create `src/tasks.ts`:**

   ```typescript
   // backend/src/tasks.ts
   export interface Task {
     id: number;
     title: string;
   }

   export const tasks: Task[] = [];
   ```

2. **Implement GET /tasks in `src/app.ts`:**

   Create (or edit) `backend/src/app.ts` with minimal code:

   ```typescript
   // backend/src/app.ts
   import express, { Request, Response } from 'express';
   import { tasks } from './tasks';
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

   export default app;
   ```

3. **Run your tests again:**  
   They should now pass for the GET /tasks endpoint.

#### Step 3: Refactor & Document

- Verify that your code is clear and follows best practices.
- Write a short note in your manual about why you wrote the test first, and how adding minimal code made the test pass.

---

### Feature 2: POST /tasks Endpoint

#### Step 1: Write the Failing Test

1. **Extend your `tasks.test.ts`:**

   Append the following test case:

   ```typescript
   // backend/tests/tasks.test.ts (append below previous tests)
   describe('POST /tasks', () => {
     it('should create a new task when valid data is provided', async () => {
       const newTask = { title: 'Test Task' };
       const response = await request(app)
         .post('/tasks')
         .send(newTask)
         .set('Accept', 'application/json');

       expect(response.status).toBe(201);
       expect(response.body).toHaveProperty('id');
       expect(response.body.title).toBe(newTask.title);
     });
   });
   ```

2. **Run the tests:**  
   They should fail because the POST endpoint isn’t implemented yet.

#### Step 2: Implement the Minimal Code

1. **Update `src/tasks.ts` to add a helper function:**

   ```typescript
   // backend/src/tasks.ts
   export interface Task {
     id: number;
     title: string;
   }

   export const tasks: Task[] = [];
   let nextId = 1;

   export const addTask = (title: string): Task => {
     const newTask: Task = { id: nextId++, title };
     tasks.push(newTask);
     return newTask;
   };
   ```

2. **Implement POST /tasks in `src/app.ts`:**

   Add the following route in your app (below the GET /tasks endpoint):

   ```typescript
   app.post('/tasks', (req: Request, res: Response) => {
     const { title } = req.body;
     if (!title) {
       res.status(400).json({ error: 'Title is required' });
       return;
     }
     
     const newTask = addTask(title);
     res.status(201).json(newTask);
   });
   ```

3. **Run your tests:**  
   They should now pass for the POST /tasks endpoint.

#### Step 3: Refactor & Document

- Confirm that error handling (returning 400 when title is missing) is clear.
- Note the importance of returning early (using `return;`) to maintain consistent handler behavior.

---

### Feature 3: GET /tasks/:id Endpoint

#### Step 1: Write the Failing Test

1. **Extend your test file:**

   Append tests for the GET /tasks/:id endpoint:

   ```typescript
   // backend/tests/tasks.test.ts (append below previous tests)
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

2. **Run the tests:**  
   They should fail since the GET /tasks/:id endpoint is not yet implemented.

#### Step 2: Implement the Minimal Code

1. **Add the GET /tasks/:id route in `src/app.ts`:**

   ```typescript
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
   ```

2. **Run your tests:**  
   They should now pass for the GET /tasks/:id endpoint.

#### Step 3: Refactor & Document

- Review your code for clarity and consistency.
- Document in your manual how writing tests first guided your implementation.

---

## 7. Frontend Integration & TDD (Manual Process)

For the frontend, you will integrate your API gradually. While you might not set up a full automated TDD cycle for the React code, follow these steps to ensure you understand the process.

### Step 1: Create a Basic React Interface

1. **Open `frontend/src/App.tsx`** and write the skeleton code that displays a header and a placeholder for tasks.

2. **Run the Frontend:**

   ```bash
   cd frontend
   npm run dev
   ```

   Verify the page renders.

### Step 2: Integrate API Calls

1. **Manually write a function to fetch tasks from your backend:**

   ```tsx
   // frontend/src/App.tsx (inside your component)
   const fetchTasks = async () => {
     try {
       const response = await fetch('http://localhost:3000/tasks');
       if (!response.ok) throw new Error('Failed to fetch tasks');
       const data: Task[] = await response.json();
       setTasks(data);
     } catch (err: any) {
       setError(err.message);
     }
   };
   ```

2. **Use `useEffect` to call `fetchTasks` when the component mounts.**

3. **Add a form to POST new tasks:**

   Write a handler that calls the POST endpoint and then updates your tasks list.

### Step 3: Test & Iterate

- Manually verify that the interface displays tasks and that you can add new tasks.
- Update your component step by step, ensuring that you understand every change.

---

## 8. Running the Project

### Starting the Backend

1. **Open a terminal in the `backend` directory:**

   ```bash
   cd backend
   npm run dev
   ```

2. **Verify the server message:**

   You should see:
   ```
   Server is running on http://localhost:3000
   ```

3. **Test API endpoints in your browser or using Postman.**

### Starting the Frontend

1. **Open another terminal in the `frontend` directory:**

   ```bash
   cd frontend
   npm run dev
   ```

2. **Open your browser to the provided URL (usually http://localhost:5173).**

3. **Verify the Task Manager UI loads and that tasks can be viewed and added.**

---

## 9. Restarting the Project (Kata Reset)

When you want to practice rebuilding from scratch:

1. **Option A: Clear Code Files**
   - Delete (or move) the contents of `backend/src` and `frontend/src` while keeping the configuration files (like `package.json`, `tsconfig.json`, and this manual).
   - Recreate your source files by following this manual.

2. **Option B: Start Fresh in the Same Repo**
   - Optionally, delete the entire repository content (including the Git directory) and reinitialize it.
   - Reinstall dependencies manually using the commands provided in sections 4 and 5.

For each reset, manually run:

**Backend:**

```bash
cd backend
npm init -y
npm install express cors
npm install --save-dev typescript ts-node nodemon jest ts-jest supertest @types/node @types/express @types/cors @types/jest @types/supertest
```

**Frontend:**

```bash
cd frontend
npm create vite@latest . --template react-ts
npm install
```

Then follow the manual to rebuild your code files step by step.

---

## 10. Troubleshooting & Common Pitfalls

- **CORS Issues:**  
  Always include `app.use(cors())` in your backend before your routes.

- **Express Handler Return Types:**  
  Use `res.status(...).json(...)` and then `return;` to ensure a consistent return type.

- **Test Failures:**  
  Run tests frequently with `npm run test` to catch errors early. Remember: a failing test tells you exactly what feature is missing.

- **Dependency Mismatch:**  
  Make sure that the API URL in your frontend (`http://localhost:3000`) matches your backend’s address.

- **File Duplication:**  
  Use the consolidated approach: `app.ts` for route definitions, and `index.ts` only to start the server.

---

## 11. Contributing & Further Enhancements

- **Contributions:**  
  When I improve tests, error handling, or add new features, I'll update this manual accordingly.

- **Next Steps:**  
  - Add a database (e.g., MySQL) to replace the in-memory store.
  - Enhance the UI with additional features.
  - Experiment with more advanced TDD patterns and refactoring techniques.

---

By following this manual each time you restart your project, you’ll build strong habits for full-stack development and the TDD process. The goal is to internalize every command, every test, and every piece of code so that eventually, you can rebuild the project from scratch without referring back to this guide.

Happy coding, and enjoy your Kata practice!

---

*End of Manual*