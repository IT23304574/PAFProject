import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { ToastService } from '../core/toast.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, NgIf],
  template: `
    <router-outlet></router-outlet>

    <div *ngIf="toast.message" style="
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #1e293b;
      color: white;
      padding: 14px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 9999;
      max-width: 360px;
    ">
      {{ toast.message }}
    </div>
  `
})
export class AppComponent {
  constructor(public toast: ToastService) {
    console.log('AppComponent constructed');
  }
}