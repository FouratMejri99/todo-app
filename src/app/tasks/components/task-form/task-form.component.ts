import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Task } from '../../../shared/models';

/**
 * Task Form Dialog Data Interface
 */
export interface TaskFormData {
  mode: 'create' | 'edit';
  task?: Task;
}

/**
 * Task Form Component
 * Dialog component for creating and editing tasks
 */
@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
  ],
  standalone: true,
})
export class TaskFormComponent implements OnInit {
  /** Task form group */
  taskForm: FormGroup;

  /** Form mode (create or edit) */
  mode: 'create' | 'edit';

  /** Task being edited (if in edit mode) */
  task?: Task;

  /** Priority options */
  priorityOptions = [
    { value: 1, label: 'Low' },
    { value: 2, label: 'Medium-Low' },
    { value: 3, label: 'Medium' },
    { value: 4, label: 'High' },
    { value: 5, label: 'Urgent' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskFormData
  ) {
    this.mode = data.mode;
    this.task = data.task;
    this.taskForm = this.createTaskForm();
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.task) {
      this.populateForm();
    }
  }

  /**
   * Create the task form with validation
   */
  private createTaskForm(): FormGroup {
    return this.formBuilder.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
      ],
      description: ['', Validators.maxLength(500)],
      priority: [
        3,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      dueDate: ['', Validators.required],
    });
  }

  /**
   * Populate form with existing task data (for edit mode)
   */
  private populateForm(): void {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description || '',
        priority: this.task.priority,
        dueDate: new Date(this.task.dueDate),
      });
    }
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;

      // Ensure due date is not in the past
      const dueDate = new Date(formValue.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        this.taskForm.get('dueDate')?.setErrors({ pastDate: true });
        return;
      }

      // Return form data to parent component
      this.dialogRef.close(formValue);
    } else {
      // Mark all fields as touched to show validation errors
      this.taskForm.markAllAsTouched();
    }
  }

  /**
   * Cancel form submission
   */
  onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Get error message for title field
   */
  getTitleErrorMessage(): string {
    const titleControl = this.taskForm.get('title');
    if (titleControl?.hasError('required')) {
      return 'Title is required';
    }
    if (titleControl?.hasError('minlength')) {
      return 'Title must be at least 1 character long';
    }
    if (titleControl?.hasError('maxlength')) {
      return 'Title cannot exceed 100 characters';
    }
    return '';
  }

  /**
   * Get error message for description field
   */
  getDescriptionErrorMessage(): string {
    const descriptionControl = this.taskForm.get('description');
    if (descriptionControl?.hasError('maxlength')) {
      return 'Description cannot exceed 500 characters';
    }
    return '';
  }

  /**
   * Get error message for priority field
   */
  getPriorityErrorMessage(): string {
    const priorityControl = this.taskForm.get('priority');
    if (priorityControl?.hasError('required')) {
      return 'Priority is required';
    }
    if (priorityControl?.hasError('min') || priorityControl?.hasError('max')) {
      return 'Priority must be between 1 and 5';
    }
    return '';
  }

  /**
   * Get error message for due date field
   */
  getDueDateErrorMessage(): string {
    const dueDateControl = this.taskForm.get('dueDate');
    if (dueDateControl?.hasError('required')) {
      return 'Due date is required';
    }
    if (dueDateControl?.hasError('pastDate')) {
      return 'Due date cannot be in the past';
    }
    return '';
  }

  /**
   * Check if field has error
   */
  hasError(fieldName: string): boolean {
    const control = this.taskForm.get(fieldName);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }

  /**
   * Get dialog title based on mode
   */
  getDialogTitle(): string {
    return this.mode === 'create' ? 'Create New Task' : 'Edit Task';
  }

  /**
   * Get submit button text based on mode
   */
  getSubmitButtonText(): string {
    return this.mode === 'create' ? 'Create Task' : 'Update Task';
  }

  /**
   * Get priority label for display
   */
  getPriorityLabel(priority: number): string {
    const option = this.priorityOptions.find((opt) => opt.value === priority);
    return option ? option.label : 'Medium';
  }

  /**
   * Get priority icon for display
   */
  getPriorityIcon(priority: number): string {
    switch (priority) {
      case 1:
        return 'keyboard_arrow_down';
      case 2:
        return 'keyboard_arrow_down';
      case 3:
        return 'remove';
      case 4:
        return 'keyboard_arrow_up';
      case 5:
        return 'keyboard_double_arrow_up';
      default:
        return 'remove';
    }
  }

  /**
   * Get minimum date for date picker (today)
   */
  getMinDate(): Date {
    return new Date();
  }
}
