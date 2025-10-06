import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../../shared/models';
import * as AuthActions from './auth.actions';

/**
 * Initial authentication state
 */
export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

/**
 * Auth Reducer
 * Handles state changes for authentication operations
 */
export const authReducer = createReducer(
  initialState,

  // Login Actions
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    loading: false,
    error,
  })),

  // Logout Actions
  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true,
  })),

  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    loading: false,
    error: null,
  })),

  // Auto Login Actions
  on(AuthActions.autoLogin, (state) => ({
    ...state,
    loading: true,
  })),

  on(AuthActions.autoLoginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),

  on(AuthActions.autoLoginFailure, (state) => ({
    ...state,
    user: null,
    loading: false,
    error: null,
  })),

  // Clear Error Action
  on(AuthActions.clearAuthError, (state) => ({
    ...state,
    error: null,
  }))
);

