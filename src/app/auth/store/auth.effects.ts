import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { User } from '../../shared/models';
import { AppState } from '../../store/app.state';
import * as AuthActions from './auth.actions';

/**
 * Auth Effects
 * Handles side effects for authentication operations
 */
@Injectable()
export class AuthEffects {
  /**
   * Login Effect
   * Simulates login process with mock authentication
   */
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ loginRequest }) => {
        // Simulate API call delay
        return new Promise<User>((resolve) => {
          setTimeout(() => {
            // Mock user creation based on email
            const user: User = {
              id: this.generateUserId(loginRequest.email),
              email: loginRequest.email,
              name: this.extractNameFromEmail(loginRequest.email),
              createdAt: new Date(),
            };
            resolve(user);
          }, 1000);
        });
      }),
      map((user) => {
        // Store user in localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(user));
        return AuthActions.loginSuccess({ user });
      }),
      catchError((error) =>
        of(AuthActions.loginFailure({ error: 'Login failed' }))
      )
    )
  );

  /**
   * Logout Effect
   * Handles user logout and cleanup
   */
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        // Clear user from localStorage
        localStorage.removeItem('currentUser');
        // Clear tasks for the user (this will be handled by tasks effects)
      }),
      map(() => AuthActions.logoutSuccess())
    )
  );

  /**
   * Auto Login Effect
   * Checks if user is already logged in from localStorage
   */
  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
          const user: User = JSON.parse(userStr);
          return AuthActions.autoLoginSuccess({ user });
        } else {
          return AuthActions.autoLoginFailure();
        }
      })
    )
  );

  constructor(private actions$: Actions, private store: Store<AppState>) {}

  /**
   * Generate a unique user ID based on email
   */
  private generateUserId(email: string): string {
    return `user_${btoa(email)
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 8)}`;
  }

  /**
   * Extract a display name from email address
   */
  private extractNameFromEmail(email: string): string {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}

