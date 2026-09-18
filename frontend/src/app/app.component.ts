import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, ToastComponent],
  template: `
    <app-toast></app-toast>
    
    <div class="app-container" *ngIf="authService.isLoggedIn(); else publicView">
      <app-sidebar></app-sidebar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>

    <ng-template #publicView>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'sms-frontend';

  constructor(public authService: AuthService) {}
}
