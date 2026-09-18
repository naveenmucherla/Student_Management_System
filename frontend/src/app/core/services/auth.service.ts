import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, Role, User } from '../models/sms.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private TOKEN_KEY = 'sms_auth_token';
  private USER_KEY = 'sms_auth_user';

  currentUser = signal<AuthResponse | null>(this.getStoredUser());
  isLoggedIn = computed(() => !!this.currentUser());
  userRole = computed(() => this.currentUser()?.role || null);
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
  isTeacher = computed(() => this.currentUser()?.role === 'TEACHER');
  isStudent = computed(() => this.currentUser()?.role === 'STUDENT');

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.saveAuth(response);
      })
    );
  }

  register(userData: { username: string; password: string; email: string; role: Role }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private saveAuth(auth: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, auth.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(auth));
    this.currentUser.set(auth);
  }

  private getStoredUser(): AuthResponse | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
}
