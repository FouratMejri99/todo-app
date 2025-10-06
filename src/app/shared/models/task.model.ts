/**
 * Task model interface
 * Represents a todo item in the application
 */
export interface Task {
  /** Unique identifier for the task */
  id: string;
  /** Task title (required) */
  title: string;
  /** Task description (optional) */
  description?: string;
  /** Priority level from 1 (low) to 5 (high) */
  priority: number;
  /** Due date for the task (must be today or future) */
  dueDate: Date;
  /** Whether the task is completed */
  completed: boolean;
  /** ID of the user who owns this task */
  userId: string;
  /** Timestamp when task was created */
  createdAt: Date;
  /** Timestamp when task was last updated */
  updatedAt: Date;
}

/**
 * Task creation interface
 * Used when creating a new task
 */
export interface CreateTaskRequest {
  /** Task title (required) */
  title: string;
  /** Task description (optional) */
  description?: string;
  /** Priority level from 1 (low) to 5 (high) */
  priority: number;
  /** Due date for the task */
  dueDate: Date;
  /** ID of the user who owns this task */
  userId: string;
}

/**
 * Task update interface
 * Used when updating an existing task
 */
export interface UpdateTaskRequest {
  /** Task ID */
  id: string;
  /** Task title (optional for updates) */
  title?: string;
  /** Task description (optional) */
  description?: string;
  /** Priority level from 1 (low) to 5 (high) */
  priority?: number;
  /** Due date for the task */
  dueDate?: Date;
  /** Whether the task is completed */
  completed?: boolean;
}

/**
 * Tasks state interface
 * Represents the tasks state in NgRx store using Entity pattern
 */
export interface TasksState {
  /** Entity adapter state for tasks */
  tasks: { [id: string]: Task };
  /** Array of task IDs */
  ids: string[];
  /** Loading state for tasks operations */
  loading: boolean;
  /** Error message if tasks operation fails */
  error: string | null;
  /** Currently selected task for editing */
  selectedTaskId: string | null;
}

