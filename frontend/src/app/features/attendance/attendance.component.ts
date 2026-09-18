import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import {
  Student, Course, ClassSection, AttendanceStatus,
  StudentAttendanceSummary, AttendanceRecord
} from '../../core/models/sms.models';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

interface StudentAttendanceRow {
  student: Student;
  status: AttendanceStatus;
  remarks: string;
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <app-navbar title="Attendance Management & Tracking"></app-navbar>

    <div class="page-wrapper animate-fade-in">
      <!-- Top Mode Selector -->
      <div class="tabs-header-bar" *ngIf="!authService.isStudent()">
        <button class="tab-btn" [ngClass]="{'active': activeMode === 'batch'}" (click)="activeMode = 'batch'">
          <i class="fas fa-clipboard-check"></i> Mark Batch Attendance
        </button>
        <button class="tab-btn" [ngClass]="{'active': activeMode === 'history'}" (click)="activeMode = 'history'">
          <i class="fas fa-history"></i> Student Attendance History & %
        </button>
      </div>

      <!-- ================= BATCH ATTENDANCE MARKER ================= -->
      <div *ngIf="activeMode === 'batch' && !authService.isStudent()" class="animate-fade-in">
        <div class="card selector-card">
          <div class="selector-grid">
            <div class="form-group">
              <label class="form-label">Select Course *</label>
              <select [(ngModel)]="selectedCourseId" (change)="onFilterChange()" class="form-control">
                <option [ngValue]="null" disabled>Choose Course</option>
                <option *ngFor="let c of courses" [ngValue]="c.id">
                  {{ c.code }} - {{ c.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Select Class Section *</label>
              <select [(ngModel)]="selectedClassId" (change)="onFilterChange()" class="form-control">
                <option [ngValue]="null" disabled>Choose Class Section</option>
                <option *ngFor="let s of sections" [ngValue]="s.id">
                  {{ s.name }} ({{ s.academicYear }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Attendance Date *</label>
              <input type="date" [(ngModel)]="selectedDate" (change)="onFilterChange()" class="form-control">
            </div>
          </div>

          <div class="batch-quick-actions" *ngIf="studentRows.length > 0">
            <div class="quick-buttons">
              <button class="btn btn-sm btn-secondary text-success" (click)="setAllStatus('PRESENT')">
                <i class="fas fa-check-double"></i> Mark All Present
              </button>
              <button class="btn btn-sm btn-secondary text-danger" (click)="setAllStatus('ABSENT')">
                <i class="fas fa-times-circle"></i> Mark All Absent
              </button>
            </div>

            <button class="btn btn-primary" (click)="submitBatchAttendance()" [disabled]="saving">
              <span *ngIf="!saving"><i class="fas fa-save"></i> Save Batch Attendance</span>
              <span *ngIf="saving"><i class="fas fa-spinner fa-spin"></i> Saving...</span>
            </button>
          </div>
        </div>

        <!-- Student Attendance Grid Table -->
        <div class="card mt-4" *ngIf="studentRows.length > 0">
          <div class="card-header">
            <h4 class="card-title">
              <i class="fas fa-user-check text-indigo"></i> Students Sheet ({{ studentRows.length }} Enrolled)
            </h4>
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Student Name</th>
                  <th>Status Toggle</th>
                  <th>Remarks (Optional)</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of studentRows">
                  <td><span class="roll-badge">{{ row.student.rollNumber }}</span></td>
                  <td><strong>{{ row.student.name }}</strong></td>
                  <td>
                    <div class="status-toggle-group">
                      <button type="button" class="toggle-btn present"
                              [ngClass]="{'active': row.status === 'PRESENT'}"
                              (click)="row.status = 'PRESENT'">
                        <i class="fas fa-check"></i> Present
                      </button>
                      <button type="button" class="toggle-btn late"
                              [ngClass]="{'active': row.status === 'LATE'}"
                              (click)="row.status = 'LATE'">
                        <i class="fas fa-clock"></i> Late
                      </button>
                      <button type="button" class="toggle-btn absent"
                              [ngClass]="{'active': row.status === 'ABSENT'}"
                              (click)="row.status = 'ABSENT'">
                        <i class="fas fa-times"></i> Absent
                      </button>
                    </div>
                  </td>
                  <td>
                    <input type="text" [(ngModel)]="row.remarks" placeholder="Add note..." class="form-control input-sm">
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card mt-4 text-center text-muted" *ngIf="studentRows.length === 0 && !loading" style="padding: 3rem;">
          <i class="fas fa-clipboard-list fa-3x mb-2" style="color: #cbd5e1;"></i>
          <p>Please select a Course and Class Section above to load student roll call.</p>
        </div>
      </div>

      <!-- ================= STUDENT HISTORY & PERCENTAGE VIEW ================= -->
      <div *ngIf="activeMode === 'history' || authService.isStudent()" class="animate-fade-in">
        <div class="card selector-card" *ngIf="!authService.isStudent()">
          <div class="form-group" style="max-width: 400px;">
            <label class="form-label">Select Student</label>
            <select [(ngModel)]="historyStudentId" (change)="loadStudentHistory()" class="form-control">
              <option [ngValue]="null" disabled>Choose a student to inspect</option>
              <option *ngFor="let s of allStudents" [ngValue]="s.id">
                {{ s.rollNumber }} - {{ s.name }} ({{ s.classSectionName }})
              </option>
            </select>
          </div>
        </div>

        <!-- Attendance Stats Cards -->
        <div class="history-stats-grid mt-4" *ngIf="studentSummary">
          <div class="stat-card">
            <div class="stat-details">
              <span class="stat-label">Calculated Attendance %</span>
              <h2 class="stat-value" [ngClass]="studentSummary.percentage >= 75 ? 'text-success' : 'text-danger'">
                {{ studentSummary.percentage }}%
              </h2>
              <span class="badge" [ngClass]="studentSummary.percentage >= 75 ? 'badge-success' : 'badge-danger'">
                {{ studentSummary.percentage >= 75 ? 'Eligible for Exams' : 'Low Attendance Alert' }}
              </span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-details">
              <span class="stat-label">Total Classes Conducted</span>
              <h2 class="stat-value">{{ studentSummary.totalClasses }}</h2>
              <small class="text-muted">Recorded Sessions</small>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-details">
              <span class="stat-label">Present vs Absent</span>
              <h2 class="stat-value text-indigo">{{ studentSummary.presentCount }} P / {{ studentSummary.absentCount }} A</h2>
              <small class="text-muted">{{ studentSummary.lateCount }} Late arrivals recorded</small>
            </div>
          </div>
        </div>

        <!-- History Records Table -->
        <div class="card mt-4" *ngIf="studentHistory.length > 0">
          <div class="card-header">
            <h4 class="card-title">
              <i class="fas fa-list text-indigo"></i> Attendance Session Logs
            </h4>
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let log of studentHistory">
                  <td><strong>{{ log.date }}</strong></td>
                  <td>{{ log.courseName }}</td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'badge-success': log.status === 'PRESENT',
                      'badge-danger': log.status === 'ABSENT',
                      'badge-warning': log.status === 'LATE'
                    }">
                      {{ log.status }}
                    </span>
                  </td>
                  <td><span class="text-muted">{{ log.remarks || '-' }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tabs-header-bar {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 0.5rem;
    }
    .tab-btn {
      padding: 0.75rem 1.25rem;
      border-radius: var(--radius-md);
      background: transparent;
      border: none;
      font-family: inherit;
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }
    .tab-btn.active {
      color: var(--primary);
      background: var(--primary-light);
      box-shadow: inset 0 -2px 0 var(--primary);
    }
    .selector-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
    }
    .batch-quick-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 1.25rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
      flex-wrap: wrap;
      gap: 1rem;
    }
    .quick-buttons {
      display: flex;
      gap: 0.75rem;
    }
    .status-toggle-group {
      display: inline-flex;
      background: #f1f5f9;
      padding: 3px;
      border-radius: var(--radius-md);
      gap: 2px;
    }
    .toggle-btn {
      padding: 0.35rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 700;
      border: none;
      border-radius: 4px;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      transition: all 0.15s;
    }
    .toggle-btn.present.active { background: var(--success); color: white; }
    .toggle-btn.late.active { background: var(--warning); color: white; }
    .toggle-btn.absent.active { background: var(--danger); color: white; }

    .input-sm {
      padding: 0.4rem 0.6rem;
      font-size: 0.825rem;
    }
    .roll-badge {
      font-family: monospace;
      font-weight: 700;
      background: #f1f5f9;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }
    .history-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
    }
    .mt-4 { margin-top: 1.5rem; }
    .text-indigo { color: var(--primary); }
    .text-success { color: var(--success); }
    .text-danger { color: var(--danger); }
  `]
})
export class AttendanceComponent implements OnInit {
  activeMode: 'batch' | 'history' = 'batch';

  courses: Course[] = [];
  sections: ClassSection[] = [];
  allStudents: Student[] = [];

  // Batch Form State
  selectedCourseId: number | null = null;
  selectedClassId: number | null = null;
  selectedDate: string = new Date().toISOString().substring(0, 10);
  studentRows: StudentAttendanceRow[] = [];
  loading = false;
  saving = false;

  // History State
  historyStudentId: number | null = null;
  studentSummary: StudentAttendanceSummary | null = null;
  studentHistory: AttendanceRecord[] = [];

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.apiService.getAllCourses().subscribe(data => {
      this.courses = data;
      if (data.length) this.selectedCourseId = data[0].id;
    });

    this.apiService.getAllClassSections().subscribe(data => {
      this.sections = data;
      if (data.length) this.selectedClassId = data[0].id;
      this.onFilterChange();
    });

    this.apiService.getAllStudents().subscribe(data => {
      this.allStudents = data;
      if (this.authService.isStudent() && this.authService.currentUser()?.studentId) {
        this.historyStudentId = this.authService.currentUser()!.studentId!;
        this.loadStudentHistory();
      } else if (data.length) {
        this.historyStudentId = data[0].id;
        this.loadStudentHistory();
      }
    });
  }

  onFilterChange() {
    if (!this.selectedClassId || !this.selectedCourseId) return;

    this.loading = true;
    this.apiService.getStudentsByClass(this.selectedClassId).subscribe({
      next: (students) => {
        // Fetch existing attendance if recorded for this date & course
        this.apiService.getClassAttendance(this.selectedClassId!, this.selectedDate).subscribe({
          next: (existing) => {
            const existingMap = new Map(existing.map(e => [e.studentId, e]));

            this.studentRows = students.map(st => {
              const prev = existingMap.get(st.id);
              return {
                student: st,
                status: prev ? prev.status : 'PRESENT',
                remarks: prev ? (prev.remarks || '') : ''
              };
            });
            this.loading = false;
          },
          error: () => {
            this.studentRows = students.map(st => ({
              student: st,
              status: 'PRESENT',
              remarks: ''
            }));
            this.loading = false;
          }
        });
      },
      error: () => this.loading = false
    });
  }

  setAllStatus(status: AttendanceStatus) {
    this.studentRows.forEach(row => row.status = status);
  }

  submitBatchAttendance() {
    if (!this.selectedCourseId || !this.studentRows.length) return;

    this.saving = true;
    const request = {
      courseId: this.selectedCourseId,
      date: this.selectedDate,
      entries: this.studentRows.map(r => ({
        studentId: r.student.id,
        status: r.status,
        remarks: r.remarks
      }))
    };

    this.apiService.markBulkAttendance(request).subscribe({
      next: () => {
        this.toast.success(`Attendance saved for ${this.studentRows.length} students!`, 'Saved');
        this.saving = false;
      },
      error: (err) => {
        this.saving = false;
        this.toast.error(err.error?.message || 'Failed to save attendance');
      }
    });
  }

  loadStudentHistory() {
    if (!this.historyStudentId) return;

    this.apiService.getStudentAttendancePercentage(this.historyStudentId).subscribe({
      next: (s) => this.studentSummary = s
    });

    this.apiService.getStudentAttendance(this.historyStudentId).subscribe({
      next: (h) => this.studentHistory = h
    });
  }
}
