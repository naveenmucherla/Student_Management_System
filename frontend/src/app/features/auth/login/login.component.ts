import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-page">
      <div class="login-card animate-fade-in">
        <div class="card-header-brand">
          <div class="logo-box">
            <i class="fas fa-graduation-cap"></i>
          </div>
          <h1>EduTrack <span>PRO</span></h1>
          <p>Next-Generation Student Management System</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label class="form-label">Username</label>
            <div class="input-with-icon">
              <i class="fas fa-user input-icon"></i>
              <input type="text" formControlName="username" class="form-control" placeholder="Enter username">
            </div>
            <span class="form-error" *ngIf="submitted && loginForm.get('username')?.errors?.['required']">
              Username is required
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-with-icon">
              <i class="fas fa-lock input-icon"></i>
              <input type="password" formControlName="password" class="form-control" placeholder="••••••••">
            </div>
            <span class="form-error" *ngIf="submitted && loginForm.get('password')?.errors?.['required']">
              Password is required
            </span>
          </div>

          <button type="submit" class="btn btn-primary submit-btn" [disabled]="loading">
            <span *ngIf="!loading">
              <i class="fas fa-sign-in-alt"></i> Sign In to Portal
            </span>
            <span *ngIf="loading">
              <i class="fas fa-spinner fa-spin"></i> Authenticating...
            </span>
          </button>
        </form>

        <div class="quick-demo-section">
          <div class="divider">
            <span>DEMO ACCOUNTS (1-CLICK FILL)</span>
          </div>
          <div class="demo-buttons-grid">
            <button type="button" class="demo-btn admin" (click)="fillCredentials('admin', 'admin123')">
              <i class="fas fa-shield-alt"></i>
              <div class="demo-btn-info">
                <strong>Admin</strong>
                <small>Full Access</small>
              </div>
            </button>
            <button type="button" class="demo-btn teacher" (click)="fillCredentials('teacher1', 'teacher123')">
              <i class="fas fa-chalkboard-teacher"></i>
              <div class="demo-btn-info">
                <strong>Teacher</strong>
                <small>Grades & Attendance</small>
              </div>
            </button>
            <button type="button" class="demo-btn student" (click)="fillCredentials('student1', 'student123')">
              <i class="fas fa-user-graduate"></i>
              <div class="demo-btn-info">
                <strong>Student</strong>
                <small>Transcript & Schedule</small>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at 10% 20%, #1e1b4b 0%, #0f172a 100%);
      padding: 1.5rem;
    }
    .login-card {
      width: 100%;
      max-width: 440px;
      background: #ffffff;
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    }
    .card-header-brand {
      text-align: center;
      margin-bottom: 2rem;
    }
    .logo-box {
      width: 54px;
      height: 54px;
      background: var(--accent-gradient);
      border-radius: 16px;
      margin: 0 auto 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      color: white;
      box-shadow: 0 8px 20px var(--primary-glow);
    }
    .card-header-brand h1 {
      font-size: 1.75rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.03em;
    }
    .card-header-brand h1 span {
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .card-header-brand p {
      font-size: 0.875rem;
      color: #64748b;
      margin-top: 0.25rem;
    }
    .input-with-icon {
      position: relative;
    }
    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
      font-size: 0.9rem;
    }
    .input-with-icon .form-control {
      padding-left: 2.5rem;
    }
    .submit-btn {
      width: 100%;
      padding: 0.85rem;
      font-size: 0.95rem;
      margin-top: 0.5rem;
    }
    .divider {
      text-align: center;
      position: relative;
      margin: 1.75rem 0 1.25rem;
    }
    .divider::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      height: 1px;
      background: var(--border-color);
    }
    .divider span {
      position: relative;
      background: #ffffff;
      padding: 0 0.75rem;
      font-size: 0.6875rem;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.05em;
    }
    .demo-buttons-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }
    .demo-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 0.5rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      background: #f8fafc;
      cursor: pointer;
      transition: all 0.2s;
      gap: 0.35rem;
    }
    .demo-btn i {
      font-size: 1.1rem;
    }
    .demo-btn.admin i { color: #ef4444; }
    .demo-btn.teacher i { color: #3b82f6; }
    .demo-btn.student i { color: #10b981; }

    .demo-btn-info {
      text-align: center;
      display: flex;
      flex-direction: column;
    }
    .demo-btn-info strong {
      font-size: 0.75rem;
      color: #1e293b;
    }
    .demo-btn-info small {
      font-size: 0.65rem;
      color: #64748b;
      white-space: nowrap;
    }
    .demo-btn:hover {
      background: #f1f5f9;
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  fillCredentials(username: string, pass: string) {
    this.loginForm.patchValue({
      username: username,
      password: pass
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.toast.success(`Welcome back, ${res.username}!`, 'Signed In');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.toast.error(err.error?.message || 'Invalid username or password', 'Login Failed');
      }
    });
  }
}
