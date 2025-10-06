import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./tasks/components/task-list/task-list.component').then(
        (m) => m.TaskListComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
