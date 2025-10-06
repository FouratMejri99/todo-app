import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../../../store/app.state';
import * as AuthActions from '../../store/auth.actions';
import * as AuthSelectors from '../../store/auth.selectors';

/**
 * Login Component
 * Handles user authentication with email input
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  standalone: true,
})
export class LoginComponent implements OnInit {
  /** Login form group */
  loginForm: FormGroup;

  /** Loading state from store */
  loading$: Observable<boolean>;

  /** Error message from store */
  error$: Observable<string | null>;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {
    this.loginForm = this.createLoginForm();
    this.loading$ = this.store.select(AuthSelectors.selectAuthLoading);
    this.error$ = this.store.select(AuthSelectors.selectAuthError);
  }

  ngOnInit(): void {
    // Clear any existing auth errors when component loads
    this.store.dispatch(AuthActions.clearAuthError());
  }

  /**
   * Create the login form with validation
   */
  private createLoginForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginRequest = {
        email: this.loginForm.get('email')?.value,
      };

      this.store.dispatch(AuthActions.login({ loginRequest }));
    } else {
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
    }
  }

  /**
   * Get error message for email field
   */
  getEmailErrorMessage(): string {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'Email is required';
    }
    if (emailControl?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  /**
   * Check if email field has error
   */
  hasEmailError(): boolean {
    const emailControl = this.loginForm.get('email');
    return !!(
      emailControl?.invalid &&
      (emailControl?.dirty || emailControl?.touched)
    );
  }
}
