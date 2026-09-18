import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { DashboardSummary } from '../../core/models/sms.models';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar title="Academic Analytics & Dashboard"></app-navbar>

    <div class="page-wrapper animate-fade-in">
      <!-- Top Metrics Row -->
      <div class="metrics-grid">
        <div class="stat-card">
          <div class="stat-icon bg-indigo">
            <i class="fas fa-user-graduate"></i>
          </div>
          <div class="stat-details">
            <span class="stat-label">Total Students</span>
            <h3 class="stat-value">{{ summary?.totalStudents || 0 }}</h3>
            <span class="stat-trend positive">
              <i class="fas fa-arrow-up"></i> Active Enrolled
            </span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon bg-sky">
            <i class="fas fa-chalkboard-teacher"></i>
          </div>
          <div class="stat-details">
            <span class="stat-label">Faculty Staff</span>
            <h3 class="stat-value">{{ summary?.totalFaculty || 0 }}</h3>
            <span class="stat-trend neutral">
              <i class="fas fa-check"></i> Academic Staff
            </span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon bg-emerald">
            <i class="fas fa-book-open"></i>
          </div>
          <div class="stat-details">
            <span class="stat-label">Active Courses</span>
            <h3 class="stat-value">{{ summary?.totalCourses || 0 }}</h3>
            <span class="stat-trend positive">
              <i class="fas fa-layer-group"></i> 5 Departments
            </span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon bg-purple">
            <i class="fas fa-calendar-check"></i>
          </div>
          <div class="stat-details">
            <span class="stat-label">Attendance Rate</span>
            <h3 class="stat-value">{{ summary?.weeklyAttendanceRate || 92.5 }}%</h3>
            <span class="stat-trend positive">
              <i class="fas fa-shield-alt"></i> Past 7 Days
            </span>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Grid -->
      <div class="dashboard-grid">
        <!-- Attendance Trend & Status Card -->
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">
              <i class="fas fa-chart-bar text-indigo"></i> Weekly Attendance Analytics
            </h4>
            <span class="badge badge-primary">Mon - Fri Trend</span>
          </div>

          <div class="chart-container">
            <div class="bar-chart-flex">
              <div *ngFor="let item of summary?.weeklyAttendanceTrend" class="chart-column">
                <div class="bar-wrapper">
                  <div class="bar-fill" [style.height.%]="item.rate > 0 ? item.rate : 15"
                       [ngClass]="{'high-rate': item.rate >= 80, 'med-rate': item.rate >= 60 && item.rate < 80, 'low-rate': item.rate < 60}">
                    <span class="bar-tooltip">{{ item.rate }}%</span>
                  </div>
                </div>
                <span class="day-label">{{ item.day }}</span>
              </div>
            </div>
          </div>

          <div class="attendance-summary-pills" *ngIf="summary?.attendanceStatusDistribution as dist">
            <div class="pill-stat">
              <span class="dot bg-success"></span>
              <span>Present: <strong>{{ dist['PRESENT'] || 0 }}</strong></span>
            </div>
            <div class="pill-stat">
              <span class="dot bg-danger"></span>
              <span>Absent: <strong>{{ dist['ABSENT'] || 0 }}</strong></span>
            </div>
            <div class="pill-stat">
              <span class="dot bg-warning"></span>
              <span>Late: <strong>{{ dist['LATE'] || 0 }}</strong></span>
            </div>
          </div>
        </div>

        <!-- Quick Actions Panel -->
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">
              <i class="fas fa-bolt text-warning"></i> Quick Operations
            </h4>
          </div>
          
          <div class="quick-actions-list">
            <a routerLink="/attendance" class="action-btn-item">
              <div class="action-icon bg-emerald">
                <i class="fas fa-clipboard-check"></i>
              </div>
              <div class="action-text">
                <strong>Mark Batch Attendance</strong>
                <p>One-click attendance sheet for class</p>
              </div>
              <i class="fas fa-chevron-right arrow"></i>
            </a>

            <a routerLink="/grades" class="action-btn-item">
              <div class="action-icon bg-indigo">
                <i class="fas fa-pen-nib"></i>
              </div>
              <div class="action-text">
                <strong>Record Exam Grades</strong>
                <p>Enter test marks and update transcripts</p>
              </div>
              <i class="fas fa-chevron-right arrow"></i>
            </a>

            <a routerLink="/students" class="action-btn-item" *ngIf="authService.isAdmin()">
              <div class="action-icon bg-purple">
                <i class="fas fa-user-plus"></i>
              </div>
              <div class="action-text">
                <strong>Student Directory</strong>
                <p>Enroll and manage student profiles</p>
              </div>
              <i class="fas fa-chevron-right arrow"></i>
            </a>

            <a routerLink="/timetable" class="action-btn-item">
              <div class="action-icon bg-sky">
                <i class="fas fa-calendar-alt"></i>
              </div>
              <div class="action-text">
                <strong>Class Schedules</strong>
                <p>View weekly lecture periods and rooms</p>
              </div>
              <i class="fas fa-chevron-right arrow"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- Course Academic Performance Table -->
      <div class="card mt-4">
        <div class="card-header">
          <h4 class="card-title">
            <i class="fas fa-graduation-cap text-sky"></i> Course Academic Grade Distribution
          </h4>
          <span class="badge badge-info">Aggregated Across Exams</span>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Avg Score</th>
                <th>Performance Bar</th>
                <th>Students Tested</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let course of summary?.courseGradeStats">
                <td><strong>{{ course.courseCode }}</strong></td>
                <td>{{ course.courseName }}</td>
                <td>
                  <span class="badge" [ngClass]="course.averagePercentage >= 75 ? 'badge-success' : 'badge-warning'">
                    {{ course.averagePercentage }}%
                  </span>
                </td>
                <td style="width: 35%;">
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill" [style.width.%]="course.averagePercentage"></div>
                  </div>
                </td>
                <td>
                  <span class="text-muted"><i class="fas fa-user"></i> {{ course.gradedStudentsCount }} graded</span>
                </td>
              </tr>
              <tr *ngIf="!summary?.courseGradeStats?.length">
                <td colspan="5" class="text-center text-muted" style="padding: 2rem;">
                  No exam grades recorded yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    .stat-icon {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      color: white;
      flex-shrink: 0;
    }
    .bg-indigo { background: linear-gradient(135deg, #4f46e5, #6366f1); }
    .bg-sky { background: linear-gradient(135deg, #0284c7, #38bdf8); }
    .bg-emerald { background: linear-gradient(135deg, #059669, #34d399); }
    .bg-purple { background: linear-gradient(135deg, #7c3aed, #a855f7); }
    
    .stat-details {
      display: flex;
      flex-direction: column;
    }
    .stat-label {
      font-size: 0.8125rem;
      color: var(--text-muted);
      font-weight: 600;
    }
    .stat-value {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--text-main);
      line-height: 1.2;
      margin: 0.15rem 0;
    }
    .stat-trend {
      font-size: 0.75rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .stat-trend.positive { color: var(--success); }
    .stat-trend.neutral { color: var(--text-muted); }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 1024px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }

    .chart-container {
      height: 220px;
      padding: 1rem 0;
    }
    .bar-chart-flex {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 170px;
      border-bottom: 2px solid var(--border-color);
      padding: 0 1rem;
    }
    .chart-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      height: 100%;
      justify-content: flex-end;
    }
    .bar-wrapper {
      width: 38px;
      height: 140px;
      display: flex;
      align-items: flex-end;
      position: relative;
    }
    .bar-fill {
      width: 100%;
      border-radius: 6px 6px 0 0;
      transition: height 0.6s ease;
      position: relative;
      cursor: pointer;
    }
    .bar-fill.high-rate { background: linear-gradient(180deg, #10b981, #059669); }
    .bar-fill.med-rate { background: linear-gradient(180deg, #f59e0b, #d97706); }
    .bar-fill.low-rate { background: linear-gradient(180deg, #ef4444, #dc2626); }

    .bar-tooltip {
      position: absolute;
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-main);
    }
    .day-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
    }
    .attendance-summary-pills {
      display: flex;
      gap: 1.25rem;
      justify-content: center;
      margin-top: 1rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-color);
    }
    .pill-stat {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8125rem;
      color: var(--text-muted);
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .bg-success { background: var(--success); }
    .bg-danger { background: var(--danger); }
    .bg-warning { background: var(--warning); }

    .quick-actions-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .action-btn-item {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 0.875rem;
      border-radius: var(--radius-md);
      background: var(--bg-main);
      border: 1px solid var(--border-color);
      text-decoration: none;
      transition: all 0.2s;
    }
    .action-btn-item:hover {
      background: #ffffff;
      transform: translateX(4px);
      box-shadow: var(--shadow-sm);
    }
    .action-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1rem;
    }
    .action-text {
      flex: 1;
    }
    .action-text strong {
      font-size: 0.875rem;
      color: var(--text-main);
      display: block;
    }
    .action-text p {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin: 0;
    }
    .arrow {
      color: var(--text-subtle);
      font-size: 0.75rem;
    }
    .mt-4 {
      margin-top: 1.5rem;
    }
    .progress-bar-bg {
      width: 100%;
      height: 8px;
      background: #e2e8f0;
      border-radius: var(--radius-full);
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      background: var(--accent-gradient);
      border-radius: var(--radius-full);
    }
    .text-indigo { color: #4f46e5; }
    .text-warning { color: #f59e0b; }
    .text-sky { color: #0284c7; }
  `]
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;
  loading = true;

  constructor(
    private apiService: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.fetchDashboard();
  }

  fetchDashboard() {
    this.apiService.getDashboardSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
