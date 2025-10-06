import { AuthState } from '../../shared/models';

/**
 * Auth feature key for NgRx store
 */
export const authFeatureKey = 'auth';

/**
 * Auth feature state interface
 * Extends the base AuthState with additional feature-specific properties if needed
 */
export interface AuthFeatureState extends AuthState {
  // Additional auth feature state properties can be added here
}

