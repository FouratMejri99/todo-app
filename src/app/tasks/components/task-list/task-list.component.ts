import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

import * as AuthSelectors from '../../../auth/store/auth.selectors';
import { Task } from '../../../shared/models';
import { AppState } from '../../../store/app.state';
import * as TaskActions from '../../store/task.actions';
import * as TaskSelectors from '../../store/task.selectors';
import { TaskFormComponent } from '../task-form/task-form.component';

/**
 * Task List Component
 * Displays and manages the list of tasks for the current user
 */
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  standalone: true,
})
export class TaskListComponent implements OnInit, OnDestroy {
  /** Tasks for the current user */
  tasks$: Observable<Task[]>;

  /** Loading state */
  loading$: Observable<boolean>;

  /** Error state */
  error$: Observable<string | null>;

  /** Current user ID */
  userId$: Observable<string | null>;

  /** Component destruction subject */
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loading$ = this.store.select(TaskSelectors.selectTaskLoading);
    this.error$ = this.store.select(TaskSelectors.selectTaskError);
    this.userId$ = this.store.select(AuthSelectors.selectUserId);

    // Combine user ID and tasks to filter tasks by current user
    this.tasks$ = combineLatest([
      this.store.select(TaskSelectors.selectAllTasks),
      this.userId$,
    ]).pipe(
      map(([tasks, userId]) =>
        userId ? tasks.filter((task) => task.userId === userId) : []
      )
    );
  }

  ngOnInit(): void {
    // Load tasks when component initializes
    this.userId$.pipe(takeUntil(this.destroy$)).subscribe((userId) => {
      if (userId) {
        this.loadTasksFromLocalStorage(userId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Open task form dialog for creating a new task
   */
  openCreateTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: false,
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userId$
          .pipe(takeUntil(this.destroy$), take(1))
          .subscribe((userId) => {
            if (userId) {
              const newTask: Task = {
                id: `task_${Date.now()}_${Math.random()
                  .toString(36)
                  .substr(2, 9)}`,
                title: result.title,
                description: result.description,
                priority: result.priority,
                dueDate: new Date(result.dueDate),
                completed: false,
                userId,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              this.store.dispatch(
                TaskActions.addTaskSuccess({ task: newTask })
              );
              this.persistAllTasksToLocalStorage();
            }
          });
      }
    });
  }

  /**
   * Open task form dialog for editing an existing task
   */
  openEditTaskDialog(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: false,
      data: { mode: 'edit', task },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedTask: Task = {
          ...task,
          ...result,
          dueDate: result.dueDate ? new Date(result.dueDate) : task.dueDate,
          updatedAt: new Date(),
        };
        this.store.dispatch(
          TaskActions.updateTaskSuccess({ task: updatedTask })
        );
        this.persistAllTasksToLocalStorage();
      }
    });
  }

  /**
   * Toggle task completion status
   */
  toggleTaskCompletion(taskId: string): void {
    this.store.dispatch(TaskActions.toggleTaskCompletion({ taskId }));
    this.persistAllTasksToLocalStorage();
  }

  /**
   * Delete a task
   */
  deleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.store.dispatch(TaskActions.deleteTaskSuccess({ taskId }));
      this.persistAllTasksToLocalStorage();
    }
  }

  /**
   * Get priority color class
   */
  getPriorityClass(priority: number): string {
    switch (priority) {
      case 1:
        return 'priority-low';
      case 2:
        return 'priority-medium-low';
      case 3:
        return 'priority-medium';
      case 4:
        return 'priority-high';
      case 5:
        return 'priority-urgent';
      default:
        return 'priority-medium';
    }
  }

  /**
   * Get priority label
   */
  getPriorityLabel(priority: number): string {
    switch (priority) {
      case 1:
        return 'Low';
      case 2:
        return 'Medium-Low';
      case 3:
        return 'Medium';
      case 4:
        return 'High';
      case 5:
        return 'Urgent';
      default:
        return 'Medium';
    }
  }

  /**
   * Check if task is overdue
   */
  isOverdue(task: Task): boolean {
    if (task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.dueDate) < today;
  }

  /**
   * Get due date display text
   */
  getDueDateText(task: Task): string {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);

    if (dueDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (dueDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return dueDate.toLocaleDateString();
    }
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.store.dispatch(TaskActions.clearTaskError());
  }

  private loadTasksFromLocalStorage(userId: string): void {
    if (
      isPlatformBrowser(this.platformId) &&
      typeof localStorage !== 'undefined'
    ) {
      const tasksStr = localStorage.getItem(`tasks_${userId}`);
      const tasks: Task[] = tasksStr ? JSON.parse(tasksStr) : [];
      const tasksWithDates = tasks.map((t) => ({
        ...t,
        dueDate: new Date(t.dueDate),
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      }));
      this.store.dispatch(
        TaskActions.loadTasksSuccess({ tasks: tasksWithDates })
      );
    } else {
      this.store.dispatch(TaskActions.loadTasksSuccess({ tasks: [] }));
    }
  }

  private persistAllTasksToLocalStorage(): void {
    if (
      !(
        isPlatformBrowser(this.platformId) &&
        typeof localStorage !== 'undefined'
      )
    ) {
      return;
    }
    // Wait a microtask to ensure state is updated
    setTimeout(() => {
      this.store
        .select(TaskSelectors.selectAllTasks)
        .pipe(take(1))
        .subscribe((allTasks) => {
          const tasksByUser = allTasks.reduce((acc, t) => {
            if (!acc[t.userId]) acc[t.userId] = [];
            acc[t.userId].push(t);
            return acc;
          }, {} as { [userId: string]: Task[] });

          Object.keys(tasksByUser).forEach((uid) => {
            localStorage.setItem(
              `tasks_${uid}`,
              JSON.stringify(tasksByUser[uid])
            );
          });
        });
    }, 0);
  }
}
