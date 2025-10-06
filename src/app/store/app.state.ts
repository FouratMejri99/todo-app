import { AuthState } from '../shared/models';
import { TaskEntityState } from '../tasks/store/task.reducer';

/**
 * App State Interface
 * Root state interface that combines all feature states
 */
export interface AppState {
  auth: AuthState;
  tasks: TaskEntityState;
}

