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

  // Handler for adding a new task
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
      // Update tasks list with the new task
      setTasks((prevTasks) => [...prevTasks, addedTask]);
      setNewTaskTitle('');
    } catch (err: any) {
      setError(err.message || 'An error occurred while adding task');
    }
  };

  return (
    <div style={{ padding: '1rem ' }}>
      <h1>Task Manager</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAddTask}>
        <input
          type='text'
          placeholder='New task title'
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button type='submit'>Add Task</button>
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
