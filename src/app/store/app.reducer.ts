import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { authReducer } from '../auth/store/auth.reducer';
import { taskReducer } from '../tasks/store/task.reducer';
import { AppState } from './app.state';

/**
 * App Reducers
 * Combines all feature reducers into the root reducer
 */
export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  tasks: taskReducer,
};

/**
 * Meta Reducers
 * Applied to all reducers (e.g., for logging, hydration, etc.)
 */
export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : [];

