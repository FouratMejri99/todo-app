import { createAction, props } from '@ngrx/store';
import {
  CreateTaskRequest,
  Task,
  UpdateTaskRequest,
} from '../../shared/models';

/**
 * Task Actions
 * Defines all actions related to task state management
 */

// Load Tasks Actions
export const loadTasks = createAction(
  '[Tasks] Load Tasks',
  props<{ userId: string }>()
);

export const loadTasksSuccess = createAction(
  '[Tasks] Load Tasks Success',
  props<{ tasks: Task[] }>()
);

export const loadTasksFailure = createAction(
  '[Tasks] Load Tasks Failure',
  props<{ error: string }>()
);

// Add Task Actions
export const addTask = createAction(
  '[Tasks] Add Task',
  props<{ createRequest: CreateTaskRequest }>()
);

export const addTaskSuccess = createAction(
  '[Tasks] Add Task Success',
  props<{ task: Task }>()
);

export const addTaskFailure = createAction(
  '[Tasks] Add Task Failure',
  props<{ error: string }>()
);

// Update Task Actions
export const updateTask = createAction(
  '[Tasks] Update Task',
  props<{ updateRequest: UpdateTaskRequest }>()
);

export const updateTaskSuccess = createAction(
  '[Tasks] Update Task Success',
  props<{ task: Task }>()
);

export const updateTaskFailure = createAction(
  '[Tasks] Update Task Failure',
  props<{ error: string }>()
);

// Delete Task Actions
export const deleteTask = createAction(
  '[Tasks] Delete Task',
  props<{ taskId: string }>()
);

export const deleteTaskSuccess = createAction(
  '[Tasks] Delete Task Success',
  props<{ taskId: string }>()
);

export const deleteTaskFailure = createAction(
  '[Tasks] Delete Task Failure',
  props<{ error: string }>()
);

// Toggle Task Completion
export const toggleTaskCompletion = createAction(
  '[Tasks] Toggle Task Completion',
  props<{ taskId: string }>()
);

// Clear Tasks (for logout)
export const clearTasks = createAction('[Tasks] Clear Tasks');

// Select Task for Editing
export const selectTask = createAction(
  '[Tasks] Select Task',
  props<{ taskId: string | null }>()
);

// Clear Error
export const clearTaskError = createAction('[Tasks] Clear Error');

