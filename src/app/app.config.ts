import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { routes } from './app.routes';
import { AuthEffects } from './auth/store/auth.effects';
import { metaReducers, reducers } from './store/app.reducer';
import { TaskEffects } from './tasks/store/task.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideStore(reducers, { metaReducers }),
    provideEffects([AuthEffects, TaskEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false, // Set to true for production
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ],
};
