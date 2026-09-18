import { Injectable, signal } from '@angular/core';
import { ToastMessage } from '../models/sms.models';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);

  show(type: 'success' | 'danger' | 'warning' | 'info', message: string, title?: string) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, type, message, title };
    this.toasts.update(current => [...current, newToast]);

    setTimeout(() => {
      this.remove(id);
    }, 4000);
  }

  success(message: string, title: string = 'Success') {
    this.show('success', message, title);
  }

  error(message: string, title: string = 'Error') {
    this.show('danger', message, title);
  }

  warning(message: string, title: string = 'Warning') {
    this.show('warning', message, title);
  }

  info(message: string, title: string = 'Info') {
    this.show('info', message, title);
  }

  remove(id: string) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
