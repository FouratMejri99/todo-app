/**
 * User model interface
 * Represents a logged-in user in the application
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** User's email address (used for login) */
  email: string;
  /** Display name for the user */
  name?: string;
  /** Timestamp when user was created */
  createdAt: Date;
}

/**
 * Login request interface
 * Used for authentication form
 */
export interface LoginRequest {
  /** User's email address */
  email: string;
}

/**
 * Auth state interface
 * Represents the authentication state in NgRx store
 */
export interface AuthState {
  /** Currently logged-in user */
  user: User | null;
  /** Loading state for auth operations */
  loading: boolean;
  /** Error message if authentication fails */
  error: string | null;
}

