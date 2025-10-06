import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Task } from '../../shared/models';
import { AppState } from '../../store/app.state';
import * as TaskActions from './task.actions';
import { selectAllTasks } from './task.selectors';

/**
 * Task Effects
 * Handles side effects for task operations
 */
@Injectable()
export class TaskEffects {
  /**
   * Load Tasks Effect
   * Loads tasks from localStorage for the current user
   */
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      switchMap(({ userId }) => {
        return new Promise<Task[]>((resolve) => {
          setTimeout(() => {
            const tasksStr = localStorage.getItem(`tasks_${userId}`);
            const tasks: Task[] = tasksStr ? JSON.parse(tasksStr) : [];
            // Convert date strings back to Date objects
            const tasksWithDates = tasks.map((task) => ({
              ...task,
              dueDate: new Date(task.dueDate),
              createdAt: new Date(task.createdAt),
              updatedAt: new Date(task.updatedAt),
            }));
            resolve(tasksWithDates);
          }, 500);
        });
      }),
      map((tasks) => TaskActions.loadTasksSuccess({ tasks })),
      catchError((error) =>
        of(TaskActions.loadTasksFailure({ error: 'Failed to load tasks' }))
      )
    )
  );

  /**
   * Add Task Effect
   * Creates a new task and saves it to localStorage
   */
  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.addTask),
      switchMap(({ createRequest }) => {
        return new Promise<Task>((resolve) => {
          setTimeout(() => {
            const task: Task = {
              id: this.generateTaskId(),
              ...createRequest,
              completed: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            resolve(task);
          }, 500);
        });
      }),
      map((task) => TaskActions.addTaskSuccess({ task })),
      catchError((error) =>
        of(TaskActions.addTaskFailure({ error: 'Failed to add task' }))
      )
    )
  );

  /**
   * Update Task Effect
   * Updates an existing task and saves it to localStorage
   */
  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      withLatestFrom(this.store.select(selectAllTasks)),
      switchMap(([{ updateRequest }, tasks]) => {
        return new Promise<Task>((resolve, reject) => {
          setTimeout(() => {
            const existingTask = tasks.find(
              (task) => task.id === updateRequest.id
            );
            if (existingTask) {
              const updatedTask: Task = {
                ...existingTask,
                ...updateRequest,
                updatedAt: new Date(),
              };
              resolve(updatedTask);
            } else {
              reject(new Error('Task not found'));
            }
          }, 500);
        });
      }),
      map((task) => TaskActions.updateTaskSuccess({ task })),
      catchError((error) =>
        of(TaskActions.updateTaskFailure({ error: 'Failed to update task' }))
      )
    )
  );

  /**
   * Delete Task Effect
   * Deletes a task from localStorage
   */
  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      map(({ taskId }) => TaskActions.deleteTaskSuccess({ taskId })),
      catchError((error) =>
        of(TaskActions.deleteTaskFailure({ error: 'Failed to delete task' }))
      )
    )
  );

  /**
   * Save Tasks to LocalStorage Effect
   * Automatically saves tasks to localStorage when they change
   */
  saveTasksToLocalStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TaskActions.loadTasksSuccess,
          TaskActions.addTaskSuccess,
          TaskActions.updateTaskSuccess,
          TaskActions.deleteTaskSuccess,
          TaskActions.toggleTaskCompletion
        ),
        withLatestFrom(this.store.select(selectAllTasks)),
        switchMap(([, tasks]) => {
          // Group tasks by userId and save to localStorage
          const tasksByUser = tasks.reduce((acc, task) => {
            if (!acc[task.userId]) {
              acc[task.userId] = [];
            }
            acc[task.userId].push(task);
            return acc;
          }, {} as { [userId: string]: Task[] });

          // Save each user's tasks to localStorage
          Object.keys(tasksByUser).forEach((userId) => {
            localStorage.setItem(
              `tasks_${userId}`,
              JSON.stringify(tasksByUser[userId])
            );
          });

          return of({ type: '[Tasks] Save to LocalStorage Success' });
        })
      ),
    { dispatch: false }
  );

  /**
   * Clear Tasks on Logout Effect
   * Clears tasks when user logs out
   */
  clearTasksOnLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[Auth] Logout Success'),
      map(() => TaskActions.clearTasks())
    )
  );

  constructor(private actions$: Actions, private store: Store<AppState>) {}

  /**
   * Generate a unique task ID
   */
  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

