import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Student, ClassSection, StudentTranscript, StudentAttendanceSummary } from '../../core/models/sms.models';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NavbarComponent],
  template: `
    <app-navbar title="Student Directory & Profiles"></app-navbar>

    <div class="page-wrapper animate-fade-in">
      <!-- Top Action Bar -->
      <div class="action-bar-card card">
        <div class="search-filters-left">
          <div class="search-input-box">
            <i class="fas fa-search search-icon"></i>
            <input type="text" [(ngModel)]="searchQuery" (input)="onSearchChange()" 
                   placeholder="Search by name, roll number, or contact..." class="form-control search-input">
          </div>

          <div class="filter-dropdown">
            <select [(ngModel)]="selectedClassId" (change)="loadStudents()" class="form-control select-input">
              <option [ngValue]="null">All Class Sections</option>
              <option *ngFor="let sec of classSections" [ngValue]="sec.id">
                {{ sec.name }} ({{ sec.academicYear }})
              </option>
            </select>
          </div>
        </div>

        <div class="action-buttons-right" *ngIf="authService.isAdmin()">
          <button class="btn btn-primary" (click)="openAddModal()">
            <i class="fas fa-user-plus"></i> Enroll Student
          </button>
        </div>
      </div>

      <!-- Students Data Table -->
      <div class="card mt-4">
        <div class="card-header">
          <h4 class="card-title">
            <i class="fas fa-users text-indigo"></i> Enrolled Students
            <span class="badge badge-primary">{{ totalElements }} Records</span>
          </h4>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Class / Year</th>
                <th>Contact</th>
                <th>Guardian Info</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of students">
                <td>
                  <span class="roll-badge">{{ s.rollNumber }}</span>
                </td>
                <td>
                  <div class="student-name-cell">
                    <div class="avatar-circle">{{ s.name.charAt(0) }}</div>
                    <div>
                      <strong>{{ s.name }}</strong>
                      <div class="sub-text">{{ s.email || 'No portal login' }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge badge-info">{{ s.classSectionName || 'N/A' }}</span>
                </td>
                <td>
                  <div>{{ s.contact || 'N/A' }}</div>
                  <small class="text-muted">{{ s.address || '' }}</small>
                </td>
                <td>
                  <div>{{ s.guardianName || 'N/A' }}</div>
                  <small class="text-muted">{{ s.guardianContact || '' }}</small>
                </td>
                <td>
                  <div class="action-buttons-group">
                    <button class="btn btn-sm btn-secondary" (click)="viewStudentProfile(s)" title="View Transcript & Stats">
                      <i class="fas fa-eye"></i> Profile
                    </button>
                    <button class="btn btn-sm btn-secondary" (click)="openEditModal(s)" *ngIf="authService.isAdmin()" title="Edit">
                      <i class="fas fa-edit text-indigo"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" (click)="confirmDelete(s)" *ngIf="authService.isAdmin()" title="Delete">
                      <i class="fas fa-trash text-danger"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="!students.length && !loading">
                <td colspan="6" class="text-center text-muted" style="padding: 2.5rem;">
                  No students found matching the filter criteria.
                </td>
              </tr>
              <tr *ngIf="loading">
                <td colspan="6" class="text-center text-muted" style="padding: 2.5rem;">
                  <i class="fas fa-spinner fa-spin"></i> Loading students...
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div class="pagination-footer" *ngIf="totalPages > 1">
          <button class="btn btn-sm btn-secondary" [disabled]="currentPage === 0" (click)="changePage(currentPage - 1)">
            <i class="fas fa-chevron-left"></i> Previous
          </button>
          <span class="page-indicator">Page {{ currentPage + 1 }} of {{ totalPages }}</span>
          <button class="btn btn-sm btn-secondary" [disabled]="currentPage >= totalPages - 1" (click)="changePage(currentPage + 1)">
            Next <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Student Add/Edit Modal -->
    <div class="modal-backdrop" *ngIf="showModal">
      <div class="modal-card animate-fade-in">
        <div class="modal-header">
          <h3>{{ isEditing ? 'Edit Student Details' : 'Enroll New Student' }}</h3>
          <button class="modal-close-btn" (click)="closeModal()">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form [formGroup]="studentForm" (ngSubmit)="saveStudent()" class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" formControlName="name" class="form-control" placeholder="e.g. John Doe">
              <span class="form-error" *ngIf="submitted && studentForm.get('name')?.errors?.['required']">
                Name is required
              </span>
            </div>

            <div class="form-group">
              <label class="form-label">Roll Number *</label>
              <input type="text" formControlName="rollNumber" class="form-control" placeholder="e.g. STU-2026-006">
              <span class="form-error" *ngIf="submitted && studentForm.get('rollNumber')?.errors?.['required']">
                Roll number is required
              </span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Class Section *</label>
              <select formControlName="classSectionId" class="form-control">
                <option [ngValue]="null" disabled>Select Class Section</option>
                <option *ngFor="let sec of classSections" [ngValue]="sec.id">
                  {{ sec.name }} ({{ sec.academicYear }})
                </option>
              </select>
              <span class="form-error" *ngIf="submitted && studentForm.get('classSectionId')?.errors?.['required']">
                Class Section is required
              </span>
            </div>

            <div class="form-group">
              <label class="form-label">Date of Birth</label>
              <input type="date" formControlName="dob" class="form-control">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Contact Number</label>
              <input type="text" formControlName="contact" class="form-control" placeholder="+1 (555) 000-0000">
            </div>

            <div class="form-group">
              <label class="form-label">Enrollment Date</label>
              <input type="date" formControlName="enrollmentDate" class="form-control">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Residential Address</label>
            <input type="text" formControlName="address" class="form-control" placeholder="Street, City, State">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Guardian / Parent Name</label>
              <input type="text" formControlName="guardianName" class="form-control" placeholder="Guardian Full Name">
            </div>

            <div class="form-group">
              <label class="form-label">Guardian Contact</label>
              <input type="text" formControlName="guardianContact" class="form-control" placeholder="+1 (555) 000-0000">
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="saving">
              <span *ngIf="!saving">{{ isEditing ? 'Save Changes' : 'Enroll Student' }}</span>
              <span *ngIf="saving"><i class="fas fa-spinner fa-spin"></i> Saving...</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Student Detail & Transcript Drawer/Modal -->
    <div class="modal-backdrop" *ngIf="showProfileModal && selectedStudent">
      <div class="modal-card modal-lg animate-fade-in">
        <div class="modal-header">
          <div class="profile-header-meta">
            <div class="avatar-large">{{ selectedStudent.name.charAt(0) }}</div>
            <div>
              <h3>{{ selectedStudent.name }}</h3>
              <div class="meta-tags">
                <span class="roll-badge">{{ selectedStudent.rollNumber }}</span>
                <span class="badge badge-info">{{ selectedStudent.classSectionName }}</span>
              </div>
            </div>
          </div>
          <button class="modal-close-btn" (click)="showProfileModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <!-- Summary Pills -->
          <div class="profile-stats-grid">
            <div class="profile-stat-box">
              <span class="p-label">Cumulative GPA</span>
              <h2 class="p-value text-indigo">{{ studentTranscript?.gpa || '0.0' }} / 4.0</h2>
              <small class="text-muted">{{ studentTranscript?.totalCredits || 0 }} Total Credits</small>
            </div>
            <div class="profile-stat-box">
              <span class="p-label">Attendance Rate</span>
              <h2 class="p-value" [ngClass]="(studentAttendance?.percentage || 0) >= 75 ? 'text-success' : 'text-danger'">
                {{ studentAttendance?.percentage || 0 }}%
              </h2>
              <small class="text-muted">{{ studentAttendance?.presentCount || 0 }} Present of {{ studentAttendance?.totalClasses || 0 }}</small>
            </div>
            <div class="profile-stat-box">
              <span class="p-label">Contact</span>
              <div class="p-text">{{ selectedStudent.contact || 'N/A' }}</div>
              <small class="text-muted">{{ selectedStudent.address || 'No address' }}</small>
            </div>
          </div>

          <!-- Academic Transcript Table -->
          <h4 class="section-title mt-4">
            <i class="fas fa-award text-indigo"></i> Academic Grades & Transcript
          </h4>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Exam / Assessment</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Points</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let g of studentTranscript?.grades">
                  <td><strong>{{ g.courseCode }}</strong> - {{ g.courseName }}</td>
                  <td>{{ g.examName }}</td>
                  <td>{{ g.marksObtained }} / {{ g.maxMarks }} ({{ g.percentage }}%)</td>
                  <td><span class="badge badge-primary">{{ g.letterGrade }}</span></td>
                  <td><strong>{{ g.gradePoint }}</strong></td>
                  <td><small class="text-muted">{{ g.remarks || '-' }}</small></td>
                </tr>
                <tr *ngIf="!studentTranscript?.grades?.length">
                  <td colspan="6" class="text-center text-muted" style="padding: 1.5rem;">
                    No exam results posted yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" (click)="showProfileModal = false">Close</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .action-bar-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 1.5rem;
      flex-wrap: wrap;
    }
    .search-filters-left {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
      min-width: 280px;
    }
    .search-input-box {
      position: relative;
      flex: 1;
      max-width: 450px;
    }
    .search-icon {
      position: absolute;
      left: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-subtle);
    }
    .search-input {
      padding-left: 2.3rem;
    }
    .select-input {
      min-width: 200px;
    }
    .mt-4 { margin-top: 1.5rem; }

    .roll-badge {
      font-family: monospace;
      font-size: 0.8125rem;
      font-weight: 700;
      background: #f1f5f9;
      color: #334155;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }
    .student-name-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .avatar-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--accent-gradient);
      color: white;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      flex-shrink: 0;
    }
    .sub-text {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .action-buttons-group {
      display: flex;
      gap: 0.4rem;
    }
    .pagination-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--border-color);
    }
    .page-indicator {
      font-size: 0.875rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    /* Modal Styles */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }
    .modal-card {
      background: #ffffff;
      border-radius: var(--radius-xl);
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-xl);
      overflow: hidden;
    }
    .modal-lg {
      max-width: 850px;
    }
    .modal-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .modal-header h3 {
      font-size: 1.2rem;
      margin: 0;
    }
    .modal-close-btn {
      background: none;
      border: none;
      font-size: 1.25rem;
      color: var(--text-muted);
      cursor: pointer;
    }
    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
    .modal-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    /* Profile Drawer Details */
    .profile-header-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .avatar-large {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--accent-gradient);
      color: white;
      font-size: 1.25rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .meta-tags {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.25rem;
    }
    .profile-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .profile-stat-box {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 1rem;
    }
    .p-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 600;
      display: block;
    }
    .p-value {
      font-size: 1.5rem;
      font-weight: 800;
      margin: 0.2rem 0;
    }
    .p-text {
      font-size: 0.9rem;
      font-weight: 600;
      margin: 0.2rem 0;
    }
    .section-title {
      font-size: 1.05rem;
      margin-bottom: 0.75rem;
    }
    .text-indigo { color: var(--primary); }
    .text-success { color: var(--success); }
    .text-danger { color: var(--danger); }
  `]
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  classSections: ClassSection[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  loading = false;
  searchQuery = '';
  selectedClassId: number | null = null;

  // Modal State
  showModal = false;
  isEditing = false;
  saving = false;
  editingStudentId: number | null = null;
  studentForm: FormGroup;
  submitted = false;

  // Profile Modal State
  showProfileModal = false;
  selectedStudent: Student | null = null;
  studentTranscript: StudentTranscript | null = null;
  studentAttendance: StudentAttendanceSummary | null = null;

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      rollNumber: ['', Validators.required],
      classSectionId: [null, Validators.required],
      dob: [''],
      contact: [''],
      address: [''],
      guardianName: [''],
      guardianContact: [''],
      enrollmentDate: [new Date().toISOString().substring(0, 10)]
    });
  }

  ngOnInit() {
    this.loadClassSections();
    this.loadStudents();
  }

  loadClassSections() {
    this.apiService.getAllClassSections().subscribe({
      next: (data) => {
        this.classSections = data;
      }
    });
  }

  loadStudents() {
    this.loading = true;
    this.apiService.getStudents(this.searchQuery, this.selectedClassId || undefined, this.currentPage, 10).subscribe({
      next: (res) => {
        this.students = res.content || [];
        this.totalElements = res.totalElements || 0;
        this.totalPages = res.totalPages || 0;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearchChange() {
    this.currentPage = 0;
    this.loadStudents();
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadStudents();
  }

  openAddModal() {
    this.isEditing = false;
    this.editingStudentId = null;
    this.submitted = false;
    this.studentForm.reset({
      enrollmentDate: new Date().toISOString().substring(0, 10),
      classSectionId: this.classSections.length ? this.classSections[0].id : null
    });
    this.showModal = true;
  }

  openEditModal(s: Student) {
    this.isEditing = true;
    this.editingStudentId = s.id;
    this.submitted = false;
    this.studentForm.patchValue({
      name: s.name,
      rollNumber: s.rollNumber,
      classSectionId: s.classSectionId,
      dob: s.dob || '',
      contact: s.contact || '',
      address: s.address || '',
      guardianName: s.guardianName || '',
      guardianContact: s.guardianContact || '',
      enrollmentDate: s.enrollmentDate || ''
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveStudent() {
    this.submitted = true;
    if (this.studentForm.invalid) return;

    this.saving = true;
    const formVal = this.studentForm.value;

    if (this.isEditing && this.editingStudentId) {
      this.apiService.updateStudent(this.editingStudentId, formVal).subscribe({
        next: () => {
          this.toast.success('Student updated successfully');
          this.saving = false;
          this.closeModal();
          this.loadStudents();
        },
        error: (err) => {
          this.saving = false;
          this.toast.error(err.error?.message || 'Failed to update student');
        }
      });
    } else {
      this.apiService.createStudent(formVal).subscribe({
        next: () => {
          this.toast.success('Student enrolled successfully');
          this.saving = false;
          this.closeModal();
          this.loadStudents();
        },
        error: (err) => {
          this.saving = false;
          this.toast.error(err.error?.message || 'Failed to create student');
        }
      });
    }
  }

  confirmDelete(s: Student) {
    if (confirm(`Are you sure you want to delete student "${s.name}" (${s.rollNumber})? This will delete associated grades and attendance records.`)) {
      this.apiService.deleteStudent(s.id).subscribe({
        next: () => {
          this.toast.success('Student deleted successfully');
          this.loadStudents();
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Failed to delete student');
        }
      });
    }
  }

  viewStudentProfile(s: Student) {
    this.selectedStudent = s;
    this.studentTranscript = null;
    this.studentAttendance = null;
    this.showProfileModal = true;

    this.apiService.getStudentTranscript(s.id).subscribe({
      next: (t) => this.studentTranscript = t
    });

    this.apiService.getStudentAttendancePercentage(s.id).subscribe({
      next: (a) => this.studentAttendance = a
    });
  }
}
