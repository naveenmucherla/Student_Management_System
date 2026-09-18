import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { TimetableSlot, ClassSection, Course, Faculty, DayOfWeek } from '../../core/models/sms.models';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavbarComponent],
  template: `
    <app-navbar title="Academic Schedules & Timetable"></app-navbar>

    <div class="page-wrapper animate-fade-in">
      <!-- Filter Bar -->
      <div class="action-bar-card card">
        <div class="filter-controls">
          <div class="form-group" style="margin: 0; min-width: 250px;">
            <label class="form-label">Filter by Class Section</label>
            <select [(ngModel)]="selectedClassId" (change)="loadTimetable()" class="form-control">
              <option [ngValue]="null">All Class Sections</option>
              <option *ngFor="let sec of sections" [ngValue]="sec.id">
                {{ sec.name }} ({{ sec.academicYear }})
              </option>
            </select>
          </div>
        </div>

        <div class="action-buttons-right" *ngIf="authService.isAdmin()">
          <button class="btn btn-primary" (click)="openAddSlotModal()">
            <i class="fas fa-plus"></i> Add Timetable Slot
          </button>
        </div>
      </div>

      <!-- Weekly Schedule Grid -->
      <div class="timetable-grid mt-4">
        <div *ngFor="let day of daysOfWeek" class="day-column card">
          <div class="day-header">
            <h3>{{ day }}</h3>
            <span class="badge badge-primary">{{ getSlotsForDay(day).length }} Classes</span>
          </div>

          <div class="slots-container">
            <div *ngFor="let slot of getSlotsForDay(day)" class="slot-card">
              <div class="slot-time">
                <i class="far fa-clock"></i> {{ formatTime(slot.startTime) }} - {{ formatTime(slot.endTime) }}
              </div>
              <h4 class="slot-course">{{ slot.courseCode }}</h4>
              <p class="slot-course-name">{{ slot.courseName }}</p>
              
              <div class="slot-meta">
                <span class="meta-item"><i class="fas fa-user-tie"></i> {{ slot.facultyName }}</span>
                <span class="meta-item"><i class="fas fa-map-marker-alt"></i> {{ slot.room || 'Room TBA' }}</span>
                <span class="meta-item" *ngIf="!selectedClassId"><i class="fas fa-layer-group"></i> {{ slot.classSectionName }}</span>
              </div>

              <div class="slot-admin-actions" *ngIf="authService.isAdmin()">
                <button class="btn-delete-slot" (click)="deleteSlot(slot.id!)" title="Delete Slot">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>

            <div *ngIf="getSlotsForDay(day).length === 0" class="no-slots-placeholder">
              <i class="fas fa-calendar-day"></i>
              <p>No lectures scheduled</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Timetable Add Modal -->
    <div class="modal-backdrop" *ngIf="showModal">
      <div class="modal-card animate-fade-in">
        <div class="modal-header">
          <h3>Schedule Timetable Slot</h3>
          <button class="modal-close-btn" (click)="showModal = false"><i class="fas fa-times"></i></button>
        </div>
        <form [formGroup]="slotForm" (ngSubmit)="saveSlot()" class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Class Section *</label>
              <select formControlName="classSectionId" class="form-control">
                <option [ngValue]="null" disabled>Select Class</option>
                <option *ngFor="let s of sections" [ngValue]="s.id">{{ s.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Course *</label>
              <select formControlName="courseId" class="form-control">
                <option [ngValue]="null" disabled>Select Course</option>
                <option *ngFor="let c of courses" [ngValue]="c.id">{{ c.code }} - {{ c.name }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Faculty Instructor *</label>
              <select formControlName="facultyId" class="form-control">
                <option [ngValue]="null" disabled>Select Faculty</option>
                <option *ngFor="let f of facultyList" [ngValue]="f.id">{{ f.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Day of Week *</label>
              <select formControlName="dayOfWeek" class="form-control">
                <option *ngFor="let d of daysOfWeek" [ngValue]="d">{{ d }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Start Time *</label>
              <input type="time" formControlName="startTime" class="form-control">
            </div>
            <div class="form-group">
              <label class="form-label">End Time *</label>
              <input type="time" formControlName="endTime" class="form-control">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Room / Lecture Hall</label>
            <input type="text" formControlName="room" class="form-control" placeholder="e.g. Room 101 or Lab 305">
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="showModal = false">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="slotForm.invalid">Add to Schedule</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .action-bar-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .timetable-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1.25rem;
      align-items: flex-start;
    }
    @media (max-width: 1200px) {
      .timetable-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 640px) {
      .timetable-grid {
        grid-template-columns: 1fr;
      }
    }
    .day-column {
      background: var(--bg-surface);
      border-radius: var(--radius-lg);
      padding: 1rem;
      min-height: 500px;
    }
    .day-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 0.75rem;
      margin-bottom: 1rem;
    }
    .day-header h3 {
      font-size: 1rem;
      font-weight: 800;
      color: var(--text-main);
    }
    .slots-container {
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }
    .slot-card {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-left: 4px solid var(--primary);
      border-radius: var(--radius-md);
      padding: 0.875rem;
      position: relative;
      transition: all 0.2s;
    }
    .slot-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
      background: #ffffff;
    }
    .slot-time {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 0.35rem;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
    .slot-course {
      font-size: 0.95rem;
      font-weight: 800;
      color: var(--text-main);
      margin: 0;
    }
    .slot-course-name {
      font-size: 0.78rem;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }
    .slot-meta {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      border-top: 1px solid #f1f5f9;
      padding-top: 0.4rem;
    }
    .meta-item {
      font-size: 0.72rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }
    .slot-admin-actions {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
    }
    .btn-delete-slot {
      background: none;
      border: none;
      color: var(--danger);
      cursor: pointer;
      font-size: 0.8rem;
      opacity: 0.6;
      transition: opacity 0.2s;
    }
    .btn-delete-slot:hover {
      opacity: 1;
    }
    .no-slots-placeholder {
      text-align: center;
      padding: 2.5rem 1rem;
      color: #cbd5e1;
      font-size: 0.8rem;
    }
    .no-slots-placeholder i {
      font-size: 1.75rem;
      margin-bottom: 0.5rem;
      display: block;
    }
    .mt-4 { margin-top: 1.5rem; }

    /* Modal */
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
      max-width: 540px;
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
export class TimetableComponent implements OnInit {
  slots: TimetableSlot[] = [];
  sections: ClassSection[] = [];
  courses: Course[] = [];
  facultyList: Faculty[] = [];

  selectedClassId: number | null = null;
  daysOfWeek: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

  showModal = false;
  slotForm: FormGroup;

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {
    this.slotForm = this.fb.group({
      classSectionId: [null, Validators.required],
      courseId: [null, Validators.required],
      facultyId: [null, Validators.required],
      dayOfWeek: ['MONDAY', Validators.required],
      startTime: ['09:00', Validators.required],
      endTime: ['10:30', Validators.required],
      room: ['Room 101']
    });
  }

  ngOnInit() {
    this.apiService.getAllClassSections().subscribe(data => {
      this.sections = data;
      if (data.length) this.slotForm.patchValue({ classSectionId: data[0].id });
    });
    this.apiService.getAllCourses().subscribe(data => {
      this.courses = data;
      if (data.length) this.slotForm.patchValue({ courseId: data[0].id });
    });
    this.apiService.getAllFaculty().subscribe(data => {
      this.facultyList = data;
      if (data.length) this.slotForm.patchValue({ facultyId: data[0].id });
    });

    this.loadTimetable();
  }

  loadTimetable() {
    this.apiService.getTimetable(this.selectedClassId || undefined).subscribe(data => {
      this.slots = data;
    });
  }

  getSlotsForDay(day: DayOfWeek): TimetableSlot[] {
    return this.slots.filter(s => s.dayOfWeek === day);
  }

  formatTime(timeStr: string): string {
    if (!timeStr) return '';
    return timeStr.substring(0, 5);
  }

  openAddSlotModal() {
    this.showModal = true;
  }

  saveSlot() {
    if (this.slotForm.invalid) return;

    this.apiService.createTimetableSlot(this.slotForm.value).subscribe({
      next: () => {
        this.toast.success('Timetable period scheduled successfully');
        this.showModal = false;
        this.loadTimetable();
      },
      error: (err) => this.toast.error(err.error?.message || 'Failed to add timetable slot')
    });
  }

  deleteSlot(id: number) {
    if (confirm('Delete this timetable lecture slot?')) {
      this.apiService.deleteTimetableSlot(id).subscribe({
        next: () => {
          this.toast.success('Slot removed');
          this.loadTimetable();
        },
        error: (err) => this.toast.error(err.error?.message || 'Failed to delete slot')
      });
    }
  }
}
