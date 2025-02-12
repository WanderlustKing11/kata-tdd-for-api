
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
