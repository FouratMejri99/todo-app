import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';

import * as AuthActions from '../../../auth/store/auth.actions';
import * as AuthSelectors from '../../../auth/store/auth.selectors';
import { AppState } from '../../../store/app.state';

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

  constructor(private store: Store<AppState>) {
    this.user$ = this.store.select(AuthSelectors.selectAuthUser);
    this.loading$ = this.store.select(AuthSelectors.selectAuthLoading);
  }

  ngOnInit(): void {
    // Auto-login check on component initialization
    this.store.dispatch(AuthActions.autoLogin());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handle logout action
   */
  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  /**
   * Get user display name
   */
  getUserDisplayName(user: any): string {
    return user?.name || user?.email || 'User';
  }
}
