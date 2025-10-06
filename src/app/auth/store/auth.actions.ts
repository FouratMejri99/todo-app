import { createAction, props } from '@ngrx/store';
import { LoginRequest, User } from '../../shared/models';

/**
 * Auth Actions
 * Defines all actions related to authentication state management
 */

// Login Actions
export const login = createAction(
  '[Auth] Login',
  props<{ loginRequest: LoginRequest }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout Actions
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

// Auto Login Actions (for checking if user is already logged in)
export const autoLogin = createAction('[Auth] Auto Login');

export const autoLoginSuccess = createAction(
  '[Auth] Auto Login Success',
  props<{ user: User }>()
);

export const autoLoginFailure = createAction('[Auth] Auto Login Failure');

// Clear Error Action
export const clearAuthError = createAction('[Auth] Clear Error');

