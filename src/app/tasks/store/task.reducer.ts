import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Task } from '../../shared/models';
import * as TaskActions from './task.actions';

/**
 * Task Entity State
 * Extends EntityState to include additional task-specific properties
 */
export interface TaskEntityState extends EntityState<Task> {
  loading: boolean;
  error: string | null;
  selectedTaskId: string | null;
}

/**
 * Entity Adapter for Tasks
 * Provides CRUD operations for task entities
 */
export const taskAdapter: EntityAdapter<Task> = createEntityAdapter<Task>({
  selectId: (task: Task) => task.id,
  sortComparer: (a: Task, b: Task) => {
    // Sort by due date, then by priority (descending), then by creation date
    const dueDateComparison = a.dueDate.getTime() - b.dueDate.getTime();
    if (dueDateComparison !== 0) return dueDateComparison;

    const priorityComparison = b.priority - a.priority;
    if (priorityComparison !== 0) return priorityComparison;

    return a.createdAt.getTime() - b.createdAt.getTime();
  },
});

/**
 * Initial Tasks State
 */
export const initialState: TaskEntityState = taskAdapter.getInitialState({
  loading: false,
  error: null,
  selectedTaskId: null,
});

/**
 * Task Reducer
 * Handles state changes for task operations using Entity Adapter
 */
export const taskReducer = createReducer(
  initialState,

  // Load Tasks Actions
  on(TaskActions.loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TaskActions.loadTasksSuccess, (state, { tasks }) =>
    taskAdapter.setAll(tasks, {
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add Task Actions
  on(TaskActions.addTask, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TaskActions.addTaskSuccess, (state, { task }) =>
    taskAdapter.addOne(task, {
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(TaskActions.addTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Task Actions
  on(TaskActions.updateTask, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TaskActions.updateTaskSuccess, (state, { task }) =>
    taskAdapter.updateOne(
      { id: task.id, changes: task },
      {
        ...state,
        loading: false,
        error: null,
      }
    )
  ),

  on(TaskActions.updateTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Task Actions
  on(TaskActions.deleteTask, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TaskActions.deleteTaskSuccess, (state, { taskId }) =>
    taskAdapter.removeOne(taskId, {
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(TaskActions.deleteTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Toggle Task Completion
  on(TaskActions.toggleTaskCompletion, (state, { taskId }) => {
    const task = state.entities[taskId];
    if (task) {
      return taskAdapter.updateOne(
        {
          id: taskId,
          changes: {
            completed: !task.completed,
            updatedAt: new Date(),
          },
        },
        state
      );
    }
    return state;
  }),

  // Clear Tasks
  on(TaskActions.clearTasks, (state) =>
    taskAdapter.removeAll({
      ...state,
      selectedTaskId: null,
    })
  ),

  // Select Task
  on(TaskActions.selectTask, (state, { taskId }) => ({
    ...state,
    selectedTaskId: taskId,
  })),

  // Clear Error
  on(TaskActions.clearTaskError, (state) => ({
    ...state,
    error: null,
  }))
);

