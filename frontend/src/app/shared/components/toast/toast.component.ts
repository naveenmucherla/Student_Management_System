import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toastService.toasts()" 
           class="toast-item" 
           [ngClass]="'toast-' + toast.type">
        <div class="toast-icon">
          <i class="fas" [ngClass]="{
            'fa-check-circle': toast.type === 'success',
            'fa-exclamation-circle': toast.type === 'danger',
            'fa-exclamation-triangle': toast.type === 'warning',
            'fa-info-circle': toast.type === 'info'
          }"></i>
        </div>
        <div class="toast-content">
          <div class="toast-title" *ngIf="toast.title">{{ toast.title }}</div>
          <div class="toast-message">{{ toast.message }}</div>
        </div>
        <button class="toast-close" (click)="toastService.remove(toast.id)">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 380px;
      width: 100%;
      pointer-events: none;
    }
    .toast-item {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      border-radius: var(--radius-md);
      background: #ffffff;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      border-left: 4px solid #3b82f6;
      animation: slideIn 0.3s ease-out;
    }
    .toast-success { border-left-color: var(--success); }
    .toast-danger { border-left-color: var(--danger); }
    .toast-warning { border-left-color: var(--warning); }
    .toast-info { border-left-color: var(--info); }
    
    .toast-icon {
      font-size: 1.25rem;
      margin-top: 0.1rem;
    }
    .toast-success .toast-icon { color: var(--success); }
    .toast-danger .toast-icon { color: var(--danger); }
    .toast-warning .toast-icon { color: var(--warning); }
    .toast-info .toast-icon { color: var(--info); }

    .toast-content {
      flex: 1;
    }
    .toast-title {
      font-weight: 700;
      font-size: 0.875rem;
      color: var(--text-main);
      margin-bottom: 0.2rem;
    }
    .toast-message {
      font-size: 0.8125rem;
      color: var(--text-muted);
      line-height: 1.35;
    }
    .toast-close {
      background: none;
      border: none;
      color: var(--text-subtle);
      cursor: pointer;
      padding: 0.2rem;
      font-size: 0.875rem;
    }
    .toast-close:hover {
      color: var(--text-main);
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
