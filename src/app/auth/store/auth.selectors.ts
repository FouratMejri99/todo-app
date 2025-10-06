import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../../shared/models';
import { authFeatureKey } from './auth.state';

/**
 * Auth Selectors
 * Provides selectors for accessing authentication state
 */

// Feature selector
export const selectAuthState = createFeatureSelector<AuthState>(authFeatureKey);

// Basic selectors
export const selectAuthUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

// Computed selectors
export const selectIsAuthenticated = createSelector(
  selectAuthUser,
  (user) => !!user
);

export const selectUserEmail = createSelector(
  selectAuthUser,
  (user) => user?.email || null
);

export const selectUserName = createSelector(
  selectAuthUser,
  (user) => user?.name || null
);

export const selectUserId = createSelector(
  selectAuthUser,
  (user) => user?.id || null
);

