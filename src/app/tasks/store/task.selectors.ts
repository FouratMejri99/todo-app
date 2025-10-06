import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Task } from '../../shared/models';
import { TaskEntityState, taskAdapter } from './task.reducer';

/**
 * Task Selectors
 * Provides selectors for accessing task state using Entity Adapter
 */

// Feature selector
export const selectTaskState = createFeatureSelector<TaskEntityState>('tasks');

// Entity selectors
export const {
  selectIds: selectTaskIds,
  selectEntities: selectTaskEntities,
  selectAll: selectAllTasks,
  selectTotal: selectTaskTotal,
} = taskAdapter.getSelectors(selectTaskState);

// Basic selectors
export const selectTaskLoading = createSelector(
  selectTaskState,
  (state: TaskEntityState) => state.loading
);

export const selectTaskError = createSelector(
  selectTaskState,
  (state: TaskEntityState) => state.error
);

export const selectSelectedTaskId = createSelector(
  selectTaskState,
  (state: TaskEntityState) => state.selectedTaskId
);

// Computed selectors
export const selectTasksByUserId = (userId: string) =>
  createSelector(selectAllTasks, (tasks: Task[]) =>
    tasks.filter((task) => task.userId === userId)
  );

export const selectTaskById = (taskId: string) =>
  createSelector(selectTaskEntities, (entities) => entities[taskId]);

export const selectSelectedTask = createSelector(
  selectTaskEntities,
  selectSelectedTaskId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : null)
);

export const selectCompletedTasks = createSelector(
  selectAllTasks,
  (tasks: Task[]) => tasks.filter((task) => task.completed)
);

export const selectPendingTasks = createSelector(
  selectAllTasks,
  (tasks: Task[]) => tasks.filter((task) => !task.completed)
);

export const selectTasksByPriority = (priority: number) =>
  createSelector(selectAllTasks, (tasks: Task[]) =>
    tasks.filter((task) => task.priority === priority)
  );

export const selectOverdueTasks = createSelector(
  selectAllTasks,
  (tasks: Task[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks.filter(
      (task) => !task.completed && new Date(task.dueDate) < today
    );
  }
);

export const selectTasksDueToday = createSelector(
  selectAllTasks,
  (tasks: Task[]) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return !task.completed && dueDate >= today && dueDate < tomorrow;
    });
  }
);

export const selectTasksByUserAndStatus = (
  userId: string,
  completed: boolean
) =>
  createSelector(selectAllTasks, (tasks: Task[]) =>
    tasks.filter(
      (task) => task.userId === userId && task.completed === completed
    )
  );
