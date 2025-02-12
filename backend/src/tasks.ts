
export interface Task {
    id: number;
    title: string;
}

// In-memory tasks store
export const tasks: Task[] = [];
