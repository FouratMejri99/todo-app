import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import * as AuthActions from '../../../auth/store/auth.actions';
import * as AuthSelectors from '../../../auth/store/auth.selectors';
import { AppState } from '../../../store/app.state';
import * as TaskActions from '../../../tasks/store/task.actions';

/**
 * Header Component
 * Application header with user info and logout functionality
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  standalone: true,
})
export class HeaderComponent implements OnInit, OnDestroy {
  /** Current user */
  user$: Observable<any>;

  /** Loading state */
  loading$: Observable<boolean>;

  /** Component destruction subject */
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.user$ = this.store.select(AuthSelectors.selectAuthUser);
    this.loading$ = this.store.select(AuthSelectors.selectAuthLoading);
  }

  ngOnInit(): void {
    // Hydrate user from localStorage since effects were removed
    if (
      isPlatformBrowser(this.platformId) &&
      typeof localStorage !== 'undefined'
    ) {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        this.store.dispatch(
          AuthActions.loginSuccess({ user: JSON.parse(userStr) })
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handle logout action
   */
  onLogout(): void {
    const isBrowser =
      isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined';

    // Remove persisted tasks for the current user
    this.store
      .select(AuthSelectors.selectAuthUser)
      .pipe(take(1))
      .subscribe((user) => {
        if (isBrowser && user?.id) {
          localStorage.removeItem(`tasks_${user.id}`);
        }
      });

    if (isBrowser) {
      localStorage.removeItem('currentUser');
    }
    this.store.dispatch(TaskActions.clearTasks());
    this.store.dispatch(AuthActions.logoutSuccess());
    this.router.navigate(['/login']);
  }

  /**
   * Get user display name
   */
  getUserDisplayName(user: any): string {
    return user?.name || user?.email || 'User';
  }
}
