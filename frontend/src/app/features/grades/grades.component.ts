import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Course, Exam, Student, Grade, StudentTranscript, GradeCreate } from '../../core/models/sms.models';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

interface MarksEntryRow {
  student: Student;
  marksObtained: number;
  remarks: string;
}

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavbarComponent],
  template: `
    <app-navbar title="Examinations, Grades & Official Transcripts"></app-navbar>

    <div class="page-wrapper animate-fade-in">
      <!-- Tabs -->
      <div class="tabs-header-bar">
        <button class="tab-btn" [ngClass]="{'active': activeTab === 'entry'}" 
                *ngIf="!authService.isStudent()" (click)="activeTab = 'entry'">
          <i class="fas fa-edit"></i> Marks Entry & Exams
        </button>
        <button class="tab-btn" [ngClass]="{'active': activeTab === 'transcript'}" (click)="activeTab = 'transcript'">
          <i class="fas fa-file-invoice"></i> Student Transcripts & GPA
        </button>
      </div>

      <!-- ================= MARKS ENTRY & EXAMS ================= -->
      <div *ngIf="activeTab === 'entry' && !authService.isStudent()" class="animate-fade-in">
        <!-- Exam selector & Create Exam button -->
        <div class="card selector-card">
          <div class="selector-row">
            <div class="form-group" style="flex: 1; max-width: 450px;">
              <label class="form-label">Select Exam to Grade *</label>
              <select [(ngModel)]="selectedExamId" (change)="onExamChange()" class="form-control">
                <option [ngValue]="null" disabled>Choose Examination</option>
                <option *ngFor="let ex of exams" [ngValue]="ex.id">
                  {{ ex.name }} - {{ ex.courseCode }} (Max: {{ ex.maxMarks }} marks)
                </option>
              </select>
            </div>

            <div class="action-buttons-right" *ngIf="authService.isAdmin() || authService.isTeacher()">
              <button class="btn btn-secondary" (click)="showExamModal = true">
                <i class="fas fa-plus"></i> Schedule New Exam
              </button>
              <button class="btn btn-primary" (click)="saveMarks()" [disabled]="marksRows.length === 0 || saving">
                <span *ngIf="!saving"><i class="fas fa-save"></i> Save All Marks</span>
                <span *ngIf="saving"><i class="fas fa-spinner fa-spin"></i> Saving...</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Marks Entry Table -->
        <div class="card mt-4" *ngIf="marksRows.length > 0">
          <div class="card-header">
            <h4 class="card-title">
              <i class="fas fa-marker text-indigo"></i> Student Marks Roster
            </h4>
            <span class="badge badge-info" *ngIf="currentExam">
              Max Marks: {{ currentExam.maxMarks }} | {{ currentExam.date }}
            </span>
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th style="width: 180px;">Marks Obtained</th>
                  <th>Percentage</th>
                  <th>Letter Grade</th>
                  <th>Teacher Feedback</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of marksRows">
                  <td><span class="roll-badge">{{ row.student.rollNumber }}</span></td>
                  <td><strong>{{ row.student.name }}</strong></td>
                  <td>
                    <input type="number" [(ngModel)]="row.marksObtained" 
                           [max]="currentExam?.maxMarks || 100" min="0" step="0.5"
                           class="form-control marks-input" placeholder="0.0">
                  </td>
                  <td>
                    <strong>{{ calculatePercent(row.marksObtained) }}%</strong>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="getBadgeClass(row.marksObtained)">
                      {{ getLetterGrade(row.marksObtained) }}
                    </span>
                  </td>
                  <td>
                    <input type="text" [(ngModel)]="row.remarks" placeholder="Optional comments..." class="form-control">
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card mt-4 text-center text-muted" *ngIf="marksRows.length === 0 && !loading" style="padding: 3rem;">
          <i class="fas fa-graduation-cap fa-3x mb-2" style="color: #cbd5e1;"></i>
          <p>Please select an Exam from the dropdown above to open the marks entry sheet.</p>
        </div>
      </div>

      <!-- ================= TRANSCRIPTS & GPA ================= -->
      <div *ngIf="activeTab === 'transcript' || authService.isStudent()" class="animate-fade-in">
        <div class="card selector-card" *ngIf="!authService.isStudent()">
          <div class="form-group" style="max-width: 400px;">
            <label class="form-label">Select Student</label>
            <select [(ngModel)]="transcriptStudentId" (change)="loadTranscript()" class="form-control">
              <option [ngValue]="null" disabled>Choose Student to generate transcript</option>
              <option *ngFor="let s of allStudents" [ngValue]="s.id">
                {{ s.rollNumber }} - {{ s.name }} ({{ s.classSectionName }})
              </option>
            </select>
          </div>
        </div>

        <!-- Official Report Card View -->
        <div class="transcript-paper card mt-4" *ngIf="transcript">
          <div class="transcript-header">
            <div class="inst-info">
              <h2>ACADEMIC TRANSCRIPT & REPORT CARD</h2>
              <p>INSTITUTE OF HIGHER EDUCATION & TECHNOLOGY</p>
            </div>
            <div class="gpa-box">
              <span class="gpa-label">CUMULATIVE GPA</span>
              <h1 class="gpa-value">{{ transcript.gpa }}</h1>
              <span class="gpa-scale">out of 4.0</span>
            </div>
          </div>

          <div class="student-meta-ribbon">
            <div>
              <span class="meta-lbl">Student Name</span>
              <strong>{{ transcript.studentName }}</strong>
            </div>
            <div>
              <span class="meta-lbl">Roll Number</span>
              <strong>{{ transcript.rollNumber }}</strong>
            </div>
            <div>
              <span class="meta-lbl">Class Cohort</span>
              <strong>{{ transcript.classSectionName }}</strong>
            </div>
            <div>
              <span class="meta-lbl">Total Credits</span>
              <strong>{{ transcript.totalCredits }} Credits</strong>
            </div>
          </div>

          <div class="table-responsive mt-4">
            <table class="data-table transcript-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Credits</th>
                  <th>Exam Title</th>
                  <th>Score / Max</th>
                  <th>Letter Grade</th>
                  <th>Grade Points</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let g of transcript.grades">
                  <td><strong>{{ g.courseCode }}</strong></td>
                  <td>{{ g.courseName }}</td>
                  <td>{{ g.credits }}</td>
                  <td>{{ g.examName }}</td>
                  <td>{{ g.marksObtained }} / {{ g.maxMarks }}</td>
                  <td>
                    <span class="badge badge-primary">{{ g.letterGrade }}</span>
                  </td>
                  <td><strong>{{ g.gradePoint }}</strong></td>
                </tr>
                <tr *ngIf="!transcript.grades.length">
                  <td colspan="7" class="text-center text-muted" style="padding: 2rem;">
                    No graded exams recorded for this student.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="transcript-footer">
            <div class="grading-scale-legend">
              <small><strong>Grading Scale:</strong> A+ (90-100%, 4.0) | A (80-89%, 3.5) | B+ (70-79%, 3.0) | B (60-69%, 2.5) | C (50-59%, 2.0) | D (40-49%, 1.5) | F (<40%, 0.0)</small>
            </div>
            <button class="btn btn-secondary" onclick="window.print()">
              <i class="fas fa-print"></i> Print Report Card
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Exam Creation Modal -->
    <div class="modal-backdrop" *ngIf="showExamModal">
      <div class="modal-card animate-fade-in">
        <div class="modal-header">
          <h3>Schedule New Examination</h3>
          <button class="modal-close-btn" (click)="showExamModal = false"><i class="fas fa-times"></i></button>
        </div>
        <form [formGroup]="examForm" (ngSubmit)="createExam()" class="modal-body">
          <div class="form-group">
            <label class="form-label">Exam Name *</label>
            <input type="text" formControlName="name" class="form-control" placeholder="e.g. Midterm Practical Exam">
          </div>
          <div class="form-group">
            <label class="form-label">Course *</label>
            <select formControlName="courseId" class="form-control">
              <option [ngValue]="null" disabled>Choose Course</option>
              <option *ngFor="let c of courses" [ngValue]="c.id">
                {{ c.code }} - {{ c.name }}
              </option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Exam Date *</label>
              <input type="date" formControlName="date" class="form-control">
            </div>
            <div class="form-group">
              <label class="form-label">Max Marks *</label>
              <input type="number" formControlName="maxMarks" class="form-control" min="1" max="1000">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="showExamModal = false">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="examForm.invalid">Create Exam</button>
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
    .tab-btn.active {
      color: var(--primary);
      background: var(--primary-light);
      box-shadow: inset 0 -2px 0 var(--primary);
    }
    .selector-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .action-buttons-right {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
    .marks-input {
      font-weight: 700;
      font-size: 1rem;
      color: var(--primary);
      width: 110px;
    }
    .roll-badge {
      font-family: monospace;
      font-weight: 700;
      background: #f1f5f9;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }
    .mt-4 { margin-top: 1.5rem; }

    /* Transcript Paper Style */
    .transcript-paper {
      background: #ffffff;
      border: 2px solid #cbd5e1;
      padding: 2.5rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
    }
    .transcript-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .inst-info h2 {
      font-size: 1.35rem;
      font-weight: 800;
      margin: 0;
      color: #0f172a;
      letter-spacing: -0.01em;
    }
    .inst-info p {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 600;
      letter-spacing: 0.05em;
    }
    .gpa-box {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 0.75rem 1.5rem;
      text-align: center;
    }
    .gpa-label {
      font-size: 0.7rem;
      font-weight: 800;
      color: var(--text-muted);
      letter-spacing: 0.05em;
      display: block;
    }
    .gpa-value {
      font-size: 2.25rem;
      font-weight: 900;
      color: var(--primary);
      line-height: 1;
      margin: 0.2rem 0;
    }
    .gpa-scale {
      font-size: 0.75rem;
      color: var(--text-subtle);
    }
    .student-meta-ribbon {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1.25rem;
      background: #f8fafc;
      padding: 1rem 1.25rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
    }
    .meta-lbl {
      font-size: 0.75rem;
      color: var(--text-muted);
      display: block;
      margin-bottom: 0.15rem;
    }
    .transcript-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
      flex-wrap: wrap;
      gap: 1rem;
    }
    .grading-scale-legend {
      color: var(--text-muted);
      max-width: 600px;
    }

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
export class GradesComponent implements OnInit {
  activeTab: 'entry' | 'transcript' = 'entry';

  exams: Exam[] = [];
  courses: Course[] = [];
  allStudents: Student[] = [];

  // Marks Entry State
  selectedExamId: number | null = null;
  currentExam: Exam | null = null;
  marksRows: MarksEntryRow[] = [];
  loading = false;
  saving = false;

  // Exam Modal
  showExamModal = false;
  examForm: FormGroup;

  // Transcript State
  transcriptStudentId: number | null = null;
  transcript: StudentTranscript | null = null;

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {
    this.examForm = this.fb.group({
      name: ['', Validators.required],
      courseId: [null, Validators.required],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      maxMarks: [100, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.apiService.getAllExams().subscribe(data => {
      this.exams = data;
      if (data.length) {
        this.selectedExamId = data[0].id;
        this.onExamChange();
      }
    });

    this.apiService.getAllCourses().subscribe(data => {
      this.courses = data;
      if (data.length) this.examForm.patchValue({ courseId: data[0].id });
    });

    this.apiService.getAllStudents().subscribe(data => {
      this.allStudents = data;
      if (this.authService.isStudent() && this.authService.currentUser()?.studentId) {
        this.transcriptStudentId = this.authService.currentUser()!.studentId!;
        this.loadTranscript();
      } else if (data.length) {
        this.transcriptStudentId = data[0].id;
        this.loadTranscript();
      }
    });
  }

  onExamChange() {
    if (!this.selectedExamId) return;

    this.currentExam = this.exams.find(e => e.id === this.selectedExamId) || null;
    this.loading = true;

    // Fetch existing grades for this exam
    this.apiService.getGradesByExam(this.selectedExamId).subscribe({
      next: (existingGrades) => {
        const gradeMap = new Map(existingGrades.map(g => [g.studentId, g]));

        this.apiService.getAllStudents().subscribe(students => {
          this.marksRows = students.map(st => {
            const existing = gradeMap.get(st.id);
            return {
              student: st,
              marksObtained: existing ? existing.marksObtained : 0,
              remarks: existing ? (existing.remarks || '') : ''
            };
          });
          this.loading = false;
        });
      },
      error: () => this.loading = false
    });
  }

  calculatePercent(marks: number): number {
    const max = this.currentExam?.maxMarks || 100;
    const p = (marks / max) * 100;
    return Math.round(p * 10) / 10;
  }

  getLetterGrade(marks: number): string {
    const p = this.calculatePercent(marks);
    if (p >= 90) return 'A+';
    if (p >= 80) return 'A';
    if (p >= 70) return 'B+';
    if (p >= 60) return 'B';
    if (p >= 50) return 'C';
    if (p >= 40) return 'D';
    return 'F';
  }

  getBadgeClass(marks: number): string {
    const p = this.calculatePercent(marks);
    if (p >= 80) return 'badge-success';
    if (p >= 50) return 'badge-warning';
    return 'badge-danger';
  }

  saveMarks() {
    if (!this.selectedExamId || !this.marksRows.length) return;

    this.saving = true;
    const grades: GradeCreate[] = this.marksRows.map(r => ({
      studentId: r.student.id,
      examId: this.selectedExamId!,
      marksObtained: r.marksObtained,
      remarks: r.remarks
    }));

    this.apiService.recordBulkGrades(grades).subscribe({
      next: () => {
        this.toast.success(`Grades recorded for ${grades.length} students!`, 'Saved');
        this.saving = false;
      },
      error: (err) => {
        this.saving = false;
        this.toast.error(err.error?.message || 'Failed to save grades');
      }
    });
  }

  createExam() {
    if (this.examForm.invalid) return;

    this.apiService.createExam(this.examForm.value).subscribe({
      next: (newExam) => {
        this.toast.success('Exam scheduled successfully');
        this.showExamModal = false;
        this.apiService.getAllExams().subscribe(data => {
          this.exams = data;
          this.selectedExamId = newExam.id;
          this.onExamChange();
        });
      },
      error: (err) => this.toast.error(err.error?.message || 'Failed to schedule exam')
    });
  }

  loadTranscript() {
    if (!this.transcriptStudentId) return;

    this.apiService.getStudentTranscript(this.transcriptStudentId).subscribe({
      next: (data) => this.transcript = data
    });
  }
}
