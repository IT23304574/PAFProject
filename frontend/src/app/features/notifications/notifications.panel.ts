import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService, Notification } from './notifications.service';
import { AuthService } from '../auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-notifications-panel',
  imports: [CommonModule],
  template: `
    <div class="notif-wrapper" style="position:relative">
      <button class="notif-btn" (click)="toggle()" title="Notifications">
        🔔
        <span *ngIf="unread.length > 0" class="badge">{{ unread.length }}</span>
      </button>

      <div *ngIf="open" class="notif-panel">
        <div class="notif-header">
          <span>Notifications</span>
          <button *ngIf="unread.length" (click)="markAll()" class="mark-btn">Mark all read</button>
        </div>
        <div *ngIf="unread.length === 0" class="notif-empty">All caught up! 🎉</div>
        <div *ngFor="let n of unread" class="notif-item" (click)="markOne(n)">
          <div class="notif-title">{{ n.title }}</div>
          <div class="notif-msg">{{ n.message }}</div>
          <div class="notif-time">{{ n.createdAt | date:'dd MMM HH:mm' }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notif-btn { background: none; border: none; font-size: 20px; cursor: pointer; position: relative; padding: 4px 8px; }
    .badge { position: absolute; top: -2px; right: -2px; background: #ef4444; color: white; border-radius: 999px; font-size: 10px; font-weight: 700; min-width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; padding: 0 4px; }
    .notif-panel { position: absolute; right: 0; top: calc(100% + 8px); width: 320px; background: white; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,.15); border: 1px solid #e5e7eb; z-index: 999; overflow: hidden; }
    .notif-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #f3f4f6; font-weight: 600; font-size: 14px; }
    .mark-btn { font-size: 12px; color: #1f5eff; background: none; border: none; cursor: pointer; }
    .notif-empty { padding: 24px; text-align: center; color: #9ca3af; font-size: 14px; }
    .notif-item { padding: 12px 16px; border-bottom: 1px solid #f9fafb; cursor: pointer; transition: background .15s; }
    .notif-item:hover { background: #f9fafb; }
    .notif-title { font-weight: 600; font-size: 14px; color: #1f2937; }
    .notif-msg   { font-size: 13px; color: #6b7280; margin-top: 2px; }
    .notif-time  { font-size: 11px; color: #9ca3af; margin-top: 4px; }
  `]
})
export class NotificationsPanel implements OnInit, OnDestroy {
  unread: Notification[] = [];
  open = false;
  private timer: any;
  private userId = '';

  constructor(private svc: NotificationsService, private auth: AuthService) {}

  ngOnInit() {
    const user = this.auth.getCurrentUser();
    if (!user?.id) return;
    this.userId = user.id;
    this.poll();
    this.timer = setInterval(() => this.poll(), 30000);
  }

  ngOnDestroy() { clearInterval(this.timer); }

  poll() {
    if (!this.userId) return;
    this.svc.unread(this.userId).subscribe({
      next: list => this.unread = list,
      error: () => {}
    });
  }

  toggle() { this.open = !this.open; }

  markAll() {
    this.svc.markAllRead(this.userId).subscribe(() => { this.unread = []; this.open = false; });
  }

  markOne(n: Notification) {
    this.svc.markAsRead(n.id, this.userId).subscribe(() => {
      this.unread = this.unread.filter(x => x.id !== n.id);
    });
  }
}