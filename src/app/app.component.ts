import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as AuthSelectors from './auth/store/auth.selectors';
import { HeaderComponent } from './shared/components/header/header.component';
import { AppState } from './store/app.state';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  /** Authentication state */
  isAuthenticated$: Observable<boolean>;

  /** Component destruction subject */
  private destroy$ = new Subject<void>();

  constructor(private store: Store<AppState>, private router: Router) {
    this.isAuthenticated$ = this.store.select(
      AuthSelectors.selectIsAuthenticated
    );
  }

  ngOnInit(): void {
    // Check if user is authenticated and redirect accordingly
    this.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          // User is authenticated, redirect to tasks if on login page
          if (this.router.url === '/login') {
            this.router.navigate(['/tasks']);
          }
        } else {
          // User is not authenticated, redirect to login if not on login page
          if (this.router.url !== '/login') {
            this.router.navigate(['/login']);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
