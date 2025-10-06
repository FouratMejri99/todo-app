import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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

import { Router } from '@angular/router';
import { User } from '../../../shared/models';
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
    private store: Store<AppState>,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
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
      const email: string = this.loginForm.get('email')?.value;
      const user: User = {
        id: `user_${this.safeBase64Encode(email)
          .replace(/[^a-zA-Z0-9]/g, '')
          .substring(0, 8)}`,
        email,
        name: this.extractNameFromEmail(email),
        createdAt: new Date(),
      };

      if (
        isPlatformBrowser(this.platformId) &&
        typeof localStorage !== 'undefined'
      ) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }

      this.store.dispatch(AuthActions.clearAuthError());
      this.store.dispatch(AuthActions.loginSuccess({ user }));
      this.router.navigate(['/tasks']);
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

  private extractNameFromEmail(email: string): string {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  private safeBase64Encode(value: string): string {
    if (typeof btoa === 'function') {
      return btoa(value);
    }
    try {
      const nodeBuffer = (globalThis as any).Buffer;
      if (nodeBuffer) {
        return nodeBuffer.from(value, 'utf-8').toString('base64');
      }
    } catch {}
    return Array.from(value)
      .map((c) => c.charCodeAt(0).toString(16))
      .join('');
  }
}
