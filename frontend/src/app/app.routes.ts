import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'students',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'TEACHER'] },
    loadComponent: () => import('./features/students/students.component').then(m => m.StudentsComponent)
  },
  {
    path: 'academics',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./features/academics/academics.component').then(m => m.AcademicsComponent)
  },
  {
    path: 'attendance',
    canActivate: [authGuard],
    loadComponent: () => import('./features/attendance/attendance.component').then(m => m.AttendanceComponent)
  },
  {
    path: 'grades',
    canActivate: [authGuard],
    loadComponent: () => import('./features/grades/grades.component').then(m => m.GradesComponent)
  },
  {
    path: 'timetable',
    canActivate: [authGuard],
    loadComponent: () => import('./features/timetable/timetable.component').then(m => m.TimetableComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
