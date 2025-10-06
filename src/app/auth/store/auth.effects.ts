import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
// Store is not required in this effects class
import { of } from 'rxjs';
import { catchError, delay, map, switchMap, tap } from 'rxjs/operators';
import { User } from '../../shared/models';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly platformId = inject(PLATFORM_ID);
  /**
   * Login Effect
   * Simulates login with a 1s delay
   */
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap((action: ReturnType<typeof AuthActions.login>) => {
        const { loginRequest } = action;

        // Create mock user
        const user: User = {
          id: this.generateUserId(loginRequest.email),
          email: loginRequest.email,
          name: this.extractNameFromEmail(loginRequest.email),
          createdAt: new Date(),
        };

        return of(user).pipe(
          delay(1000), // simulate API delay
          map((user: User) => {
            if (
              isPlatformBrowser(this.platformId) &&
              typeof localStorage !== 'undefined'
            ) {
              localStorage.setItem('currentUser', JSON.stringify(user));
            }
            return AuthActions.loginSuccess({ user });
          }),
          catchError(() =>
            of(AuthActions.loginFailure({ error: 'Login failed' }))
          )
        );
      })
    )
  );

  /**
   * Logout Effect
   */
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        if (
          isPlatformBrowser(this.platformId) &&
          typeof localStorage !== 'undefined'
        ) {
          localStorage.removeItem('currentUser');
        }
      }),
      map(() => AuthActions.logoutSuccess())
    )
  );

  /**
   * Auto Login Effect
   */
  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        const userStr =
          isPlatformBrowser(this.platformId) &&
          typeof localStorage !== 'undefined'
            ? localStorage.getItem('currentUser')
            : null;

        if (userStr) {
          const user: User = JSON.parse(userStr);
          return AuthActions.autoLoginSuccess({ user });
        } else {
          return AuthActions.autoLoginFailure();
        }
      })
    )
  );

  constructor() {}

  /**
   * Generate a unique user ID from email
   */
  private generateUserId(email: string): string {
    const base64 = this.safeBase64Encode(email);
    return `user_${base64.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`;
  }

  /**
   * Extract display name from email
   */
  private extractNameFromEmail(email: string): string {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  /**
   * Safe Base64 encoding (browser + Node.js)
   */
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
