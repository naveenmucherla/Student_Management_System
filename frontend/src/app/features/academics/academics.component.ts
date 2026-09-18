import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Course, ClassSection } from '../../core/models/sms.models';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-academics',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  template: `
    <app-navbar title="Academics & Department Curriculum"></app-navbar>

    <div class="page-wrapper animate-fade-in">
      <!-- Tab Navigation -->
      <div class="tabs-header-bar">
        <button class="tab-btn" [ngClass]="{'active': activeTab === 'courses'}" (click)="activeTab = 'courses'">
          <i class="fas fa-book-open"></i> Course Catalog ({{ courses.length }})
        </button>
        <button class="tab-btn" [ngClass]="{'active': activeTab === 'sections'}" (click)="activeTab = 'sections'">
          <i class="fas fa-layer-group"></i> Class Sections ({{ sections.length }})
        </button>
      </div>

      <!-- ================= COURSES TAB ================= -->
      <div *ngIf="activeTab === 'courses'" class="animate-fade-in">
        <div class="action-bar-card card">
          <div>
            <h3 class="section-heading">Curriculum Courses</h3>
            <p class="section-subheading">Manage academic subjects, credits, and syllabus codes</p>
          </div>
          <button class="btn btn-primary" (click)="openCourseModal()">
            <i class="fas fa-plus"></i> Add New Course
          </button>
        </div>

        <div class="courses-grid mt-4">
          <div *ngFor="let c of courses" class="course-card card">
            <div class="course-card-top">
              <span class="course-code-tag">{{ c.code }}</span>
              <span class="badge badge-primary">{{ c.credits }} Credits</span>
            </div>
            <h4 class="course-title">{{ c.name }}</h4>
            <p class="course-desc">{{ c.description || 'No description provided.' }}</p>

            <div class="course-card-footer">
              <span class="enrolled-badge">
                <i class="fas fa-user-check"></i> {{ c.enrolledStudentsCount || 0 }} Enrolled
              </span>
              <div class="card-actions">
                <button class="btn btn-sm btn-secondary" (click)="editCourse(c)" title="Edit Course">
                  <i class="fas fa-edit text-indigo"></i>
                </button>
                <button class="btn btn-sm btn-secondary" (click)="deleteCourse(c)" title="Delete Course">
                  <i class="fas fa-trash text-danger"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= SECTIONS TAB ================= -->
      <div *ngIf="activeTab === 'sections'" class="animate-fade-in">
        <div class="action-bar-card card">
          <div>
            <h3 class="section-heading">Class Cohorts & Sections</h3>
            <p class="section-subheading">Manage academic batches and assigned homeroom allocations</p>
          </div>
          <button class="btn btn-primary" (click)="openSectionModal()">
            <i class="fas fa-plus"></i> Add Class Section
          </button>
        </div>

        <div class="card mt-4">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Class Section Name</th>
                  <th>Academic Year</th>
                  <th>Room / Lab</th>
                  <th>Enrolled Students</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let s of sections">
                  <td><strong>{{ s.name }}</strong></td>
                  <td><span class="badge badge-info">{{ s.academicYear }}</span></td>
                  <td>{{ s.roomNumber || 'Unassigned' }}</td>
                  <td>
                    <span class="badge badge-primary">
                      <i class="fas fa-users"></i> {{ s.studentCount || 0 }} Students
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons-group">
                      <button class="btn btn-sm btn-secondary" (click)="editSection(s)">
                        <i class="fas fa-edit text-indigo"></i> Edit
                      </button>
                      <button class="btn btn-sm btn-secondary" (click)="deleteSection(s)">
                        <i class="fas fa-trash text-danger"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Course Modal -->
    <div class="modal-backdrop" *ngIf="showCourseModal">
      <div class="modal-card animate-fade-in">
        <div class="modal-header">
          <h3>{{ editingCourseId ? 'Edit Course' : 'Create New Course' }}</h3>
          <button class="modal-close-btn" (click)="showCourseModal = false"><i class="fas fa-times"></i></button>
        </div>
        <form [formGroup]="courseForm" (ngSubmit)="saveCourse()" class="modal-body">
          <div class="form-group">
            <label class="form-label">Course Title *</label>
            <input type="text" formControlName="name" class="form-control" placeholder="e.g. Data Structures & Algorithms">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Course Code *</label>
              <input type="text" formControlName="code" class="form-control" placeholder="e.g. CS201">
            </div>
            <div class="form-group">
              <label class="form-label">Credits *</label>
              <input type="number" formControlName="credits" class="form-control" min="1" max="10">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Description / Syllabus</label>
            <textarea formControlName="description" class="form-control" rows="3" placeholder="Brief synopsis of topics covered..."></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="showCourseModal = false">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="courseForm.invalid">Save Course</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Class Section Modal -->
    <div class="modal-backdrop" *ngIf="showSectionModal">
      <div class="modal-card animate-fade-in">
        <div class="modal-header">
          <h3>{{ editingSectionId ? 'Edit Class Section' : 'Create Class Section' }}</h3>
          <button class="modal-close-btn" (click)="showSectionModal = false"><i class="fas fa-times"></i></button>
        </div>
        <form [formGroup]="sectionForm" (ngSubmit)="saveSection()" class="modal-body">
          <div class="form-group">
            <label class="form-label">Section Name *</label>
            <input type="text" formControlName="name" class="form-control" placeholder="e.g. Grade 10-A or CSE-3A">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Academic Year *</label>
              <input type="text" formControlName="academicYear" class="form-control" placeholder="e.g. 2025-2026">
            </div>
            <div class="form-group">
              <label class="form-label">Room / Hall</label>
              <input type="text" formControlName="roomNumber" class="form-control" placeholder="e.g. Room 101">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="showSectionModal = false">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="sectionForm.invalid">Save Section</button>
          </div>
        </form>
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
    .tab-btn:hover {
      color: var(--primary);
      background: var(--primary-light);
    }
    .tab-btn.active {
      color: var(--primary);
      background: var(--primary-light);
      box-shadow: inset 0 -2px 0 var(--primary);
    }
    .action-bar-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .section-heading {
      font-size: 1.25rem;
      margin: 0;
    }
    .section-subheading {
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin-top: 0.15rem;
    }
    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .course-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 200px;
    }
    .course-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .course-code-tag {
      font-family: monospace;
      font-weight: 800;
      font-size: 0.85rem;
      color: var(--primary);
      background: var(--primary-light);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }
    .course-title {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      color: var(--text-main);
    }
    .course-desc {
      font-size: 0.825rem;
      color: var(--text-muted);
      flex: 1;
      margin-bottom: 1rem;
    }
    .course-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-color);
    }
    .enrolled-badge {
      font-size: 0.8rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }
    .card-actions, .action-buttons-group {
      display: flex;
      gap: 0.4rem;
    }
    .mt-4 { margin-top: 1.5rem; }

    /* Modal Backdrop */
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
      max-width: 520px;
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }
    .modal-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .modal-header h3 { font-size: 1.2rem; margin: 0; }
    .modal-close-btn { background: none; border: none; font-size: 1.25rem; color: var(--text-muted); cursor: pointer; }
    .modal-body { padding: 1.5rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .modal-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
  `]
})
export class AcademicsComponent implements OnInit {
  activeTab: 'courses' | 'sections' = 'courses';
  courses: Course[] = [];
  sections: ClassSection[] = [];

  showCourseModal = false;
  editingCourseId: number | null = null;
  courseForm: FormGroup;

  showSectionModal = false;
  editingSectionId: number | null = null;
  sectionForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      credits: [3, [Validators.required, Validators.min(1)]],
      description: ['']
    });

    this.sectionForm = this.fb.group({
      name: ['', Validators.required],
      academicYear: ['2025-2026', Validators.required],
      roomNumber: ['']
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.apiService.getAllCourses().subscribe(data => this.courses = data);
    this.apiService.getAllClassSections().subscribe(data => this.sections = data);
  }

  // Course handlers
  openCourseModal() {
    this.editingCourseId = null;
    this.courseForm.reset({ credits: 3 });
    this.showCourseModal = true;
  }

  editCourse(c: Course) {
    this.editingCourseId = c.id;
    this.courseForm.patchValue({
      name: c.name,
      code: c.code,
      credits: c.credits,
      description: c.description || ''
    });
    this.showCourseModal = true;
  }

  saveCourse() {
    if (this.courseForm.invalid) return;
    const val = this.courseForm.value;

    if (this.editingCourseId) {
      this.apiService.updateCourse(this.editingCourseId, val).subscribe({
        next: () => {
          this.toast.success('Course updated successfully');
          this.showCourseModal = false;
          this.loadData();
        },
        error: (err) => this.toast.error(err.error?.message || 'Failed to update course')
      });
    } else {
      this.apiService.createCourse(val).subscribe({
        next: () => {
          this.toast.success('Course created successfully');
          this.showCourseModal = false;
          this.loadData();
        },
        error: (err) => this.toast.error(err.error?.message || 'Failed to create course')
      });
    }
  }

  deleteCourse(c: Course) {
    if (confirm(`Delete course "${c.name}" (${c.code})?`)) {
      this.apiService.deleteCourse(c.id).subscribe({
        next: () => {
          this.toast.success('Course deleted');
          this.loadData();
        },
        error: (err) => this.toast.error(err.error?.message || 'Failed to delete course')
      });
    }
  }

  // Section handlers
  openSectionModal() {
    this.editingSectionId = null;
    this.sectionForm.reset({ academicYear: '2025-2026' });
    this.showSectionModal = true;
  }

  editSection(s: ClassSection) {
    this.editingSectionId = s.id;
    this.sectionForm.patchValue({
      name: s.name,
      academicYear: s.academicYear,
      roomNumber: s.roomNumber || ''
    });
    this.showSectionModal = true;
  }

  saveSection() {
    if (this.sectionForm.invalid) return;
    const val = this.sectionForm.value;

    if (this.editingSectionId) {
      this.apiService.updateClassSection(this.editingSectionId, val).subscribe({
        next: () => {
          this.toast.success('Section updated successfully');
          this.showSectionModal = false;
          this.loadData();
        },
        error: (err) => this.toast.error(err.error?.message || 'Failed to update section')
      });
    } else {
      this.apiService.createClassSection(val).subscribe({
        next: () => {
          this.toast.success('Section created successfully');
          this.showSectionModal = false;
          this.loadData();
        },
        error: (err) => this.toast.error(err.error?.message || 'Failed to create section')
      });
    }
  }

  deleteSection(s: ClassSection) {
    if (confirm(`Delete class section "${s.name}"?`)) {
      this.apiService.deleteClassSection(s.id).subscribe({
        next: () => {
          this.toast.success('Section deleted');
          this.loadData();
        },
        error: (err) => this.toast.error(err.error?.message || 'Failed to delete section')
      });
    }
  }
}
