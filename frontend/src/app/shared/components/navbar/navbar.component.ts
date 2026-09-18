import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <header class="navbar">
      <div class="navbar-left">
        <h1 class="page-title">{{ title }}</h1>
        <span class="date-badge">
          <i class="far fa-calendar-alt"></i> {{ today | date:'fullDate' }}
        </span>
      </div>

      <div class="navbar-right">
        <div class="status-indicator">
          <span class="pulse-dot"></span>
          <span>System Online</span>
        </div>

        <div class="user-pill" *ngIf="authService.currentUser() as user">
          <i class="fas fa-shield-alt"></i>
          <span>Logged in as <strong>{{ user.username }}</strong> ({{ user.role }})</span>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      height: 70px;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .navbar-left {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .page-title {
      font-size: 1.35rem;
      font-weight: 800;
      margin: 0;
    }
    .date-badge {
      font-size: 0.8125rem;
      color: var(--text-muted);
      background: var(--bg-main);
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-full);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .navbar-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      background-color: var(--success);
      border-radius: 50%;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .user-pill {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--primary-light);
      color: var(--primary);
      padding: 0.4rem 0.85rem;
      border-radius: var(--radius-full);
      font-size: 0.8125rem;
    }
  `]
})
export class NavbarComponent {
  @Input() title: string = 'Student Management System';
  today = new Date();

  constructor(public authService: AuthService) {}
}
