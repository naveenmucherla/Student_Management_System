import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-logo">
          <i class="fas fa-graduation-cap"></i>
        </div>
        <div class="brand-text">
          <h2>EduTrack <span class="badge-pro">PRO</span></h2>
          <p>Student Management</p>
        </div>
      </div>

      <div class="user-profile-badge" *ngIf="authService.currentUser() as user">
        <div class="user-avatar">
          {{ user.username.charAt(0).toUpperCase() }}
        </div>
        <div class="user-info">
          <span class="user-name">{{ user.username }}</span>
          <span class="role-tag" [ngClass]="user.role.toLowerCase()">
            {{ user.role }}
          </span>
        </div>
      </div>

      <nav class="nav-menu">
        <div class="nav-section-title">MAIN MENU</div>
        
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <i class="fas fa-chart-pie nav-icon"></i>
          <span>Dashboard</span>
        </a>

        <a routerLink="/students" routerLinkActive="active" class="nav-item" *ngIf="!authService.isStudent()">
          <i class="fas fa-user-graduate nav-icon"></i>
          <span>Students</span>
        </a>

        <a routerLink="/academics" routerLinkActive="active" class="nav-item" *ngIf="authService.isAdmin()">
          <i class="fas fa-book-open nav-icon"></i>
          <span>Academics</span>
        </a>

        <a routerLink="/attendance" routerLinkActive="active" class="nav-item">
          <i class="fas fa-calendar-check nav-icon"></i>
          <span>Attendance</span>
        </a>

        <a routerLink="/grades" routerLinkActive="active" class="nav-item">
          <i class="fas fa-award nav-icon"></i>
          <span>Grades & Transcript</span>
        </a>

        <a routerLink="/timetable" routerLinkActive="active" class="nav-item">
          <i class="fas fa-clock nav-icon"></i>
          <span>Timetable</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <button class="logout-btn" (click)="authService.logout()">
          <i class="fas fa-sign-out-alt"></i>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: 100vh;
      background: #0f172a;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #1e293b;
      flex-shrink: 0;
    }
    .brand {
      padding: 1.5rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.875rem;
      border-bottom: 1px solid #1e293b;
    }
    .brand-logo {
      width: 42px;
      height: 42px;
      background: var(--accent-gradient);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: #ffffff;
      box-shadow: 0 4px 12px var(--primary-glow);
    }
    .brand-text h2 {
      font-size: 1.15rem;
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }
    .badge-pro {
      font-size: 0.65rem;
      padding: 0.15rem 0.4rem;
      background: #3b82f6;
      border-radius: 4px;
      font-weight: 800;
    }
    .brand-text p {
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .user-profile-badge {
      margin: 1rem 1.25rem 0.5rem;
      padding: 0.75rem;
      background: #1e293b;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-full);
      background: #4f46e5;
      color: white;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
    }
    .user-info {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      overflow: hidden;
    }
    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #f1f5f9;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .role-tag {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      text-transform: uppercase;
      width: fit-content;
    }
    .role-tag.admin { background: rgba(239, 68, 68, 0.2); color: #f87171; }
    .role-tag.teacher { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
    .role-tag.student { background: rgba(16, 185, 129, 0.2); color: #34d399; }

    .nav-menu {
      padding: 1rem 0.75rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      overflow-y: auto;
    }
    .nav-section-title {
      font-size: 0.7rem;
      font-weight: 700;
      color: #64748b;
      padding: 0.5rem 0.75rem 0.25rem;
      letter-spacing: 0.05em;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s;
    }
    .nav-icon {
      font-size: 1.1rem;
      width: 20px;
      text-align: center;
    }
    .nav-item:hover {
      background: #1e293b;
      color: #f8fafc;
    }
    .nav-item.active {
      background: var(--primary);
      color: #ffffff;
      font-weight: 600;
      box-shadow: 0 4px 12px var(--primary-glow);
    }
    .sidebar-footer {
      padding: 1.25rem;
      border-top: 1px solid #1e293b;
    }
    .logout-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: var(--radius-md);
      cursor: pointer;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.2s;
    }
    .logout-btn:hover {
      background: #ef4444;
      color: #ffffff;
    }
  `]
})
export class SidebarComponent {
  constructor(public authService: AuthService) {}
}
