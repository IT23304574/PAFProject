import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { NotificationsService, Notification } from './notifications.service';
import { timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  standalone: true,
  selector: 'app-notifications-panel',
  imports: [NgIf, NgFor, ClickOutsideDirective],
  template: `
    <div class="notifications-container">
      <button
        class="notifications-button"
        (click)="toggle()"
        [disabled]="loading"
        [class.has-unread]="count > 0"
      >
        <span class="bell-icon">🔔</span>
        <span class="notification-count" *ngIf="count > 0">{{ count }}</span>
        <span class="loading-indicator" *ngIf="loading">⟳</span>
      </button>

      <div class="notifications-dropdown" *ngIf="open" (clickOutside)="close()">
        <div class="dropdown-header">
          <h4>Notifications</h4>
          <button
            class="mark-all-read-btn"
            (click)="markAll()"
            [disabled]="count === 0"
          >
            Mark all read
          </button>
        </div>

        <div class="notifications-list">
          <div
            class="notification-item"
            *ngFor="let notification of items"
            [class.unread]="!notification.read"
          >
            <div class="notification-icon">
              <span class="icon">{{ getNotificationIcon(notification.type || 'default') }}</span>
            </div>
            <div class="notification-content">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-time">{{ formatTime(notification.createdAt) }}</div>
            </div>
            <div class="notification-actions">
              <button
                class="mark-read-btn"
                (click)="markAsRead(notification.id)"
                *ngIf="!notification.read"
                title="Mark as read"
              >
                ✓
              </button>
            </div>
          </div>

          <div class="empty-state" *ngIf="items.length === 0">
            <div class="empty-icon">📭</div>
            <p>No unread notifications</p>
          </div>
        </div>

        <div class="dropdown-footer" *ngIf="items.length > 0">
          <button class="view-all-btn" (click)="viewAll()">
            View all notifications
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      position: relative;
      display: inline-block;
    }

    .notifications-button {
      position: relative;
      background: none;
      border: none;
      padding: 8px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: background-color 0.2s;
      color: var(--gray-600);
    }

    .notifications-button:hover {
      background: var(--gray-100);
    }

    .notifications-button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    .notifications-button.has-unread {
      color: var(--primary);
    }

    .bell-icon {
      font-size: 18px;
    }

    .notification-count {
      background: var(--error);
      color: white;
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: 600;
      min-width: 16px;
      text-align: center;
    }

    .loading-indicator {
      animation: spin 1s linear infinite;
      font-size: 14px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .notifications-dropdown {
      position: absolute;
      right: 0;
      top: 44px;
      width: 380px;
      max-height: 500px;
      background: white;
      border: 1px solid var(--gray-200);
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      display: flex;
      flex-direction: column;
    }

    .dropdown-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--gray-200);
    }

    .dropdown-header h4 {
      margin: 0;
      color: var(--gray-900);
      font-size: 16px;
      font-weight: 600;
    }

    .mark-all-read-btn {
      background: none;
      border: none;
      color: var(--primary);
      font-size: 14px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .mark-all-read-btn:hover:not(:disabled) {
      background: var(--primary-light);
    }

    .mark-all-read-btn:disabled {
      color: var(--gray-400);
      cursor: not-allowed;
    }

    .notifications-list {
      flex: 1;
      overflow-y: auto;
      max-height: 350px;
    }

    .notification-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--gray-100);
      transition: background-color 0.2s;
    }

    .notification-item:hover {
      background: var(--gray-50);
    }

    .notification-item.unread {
      background: var(--primary-light);
      border-left: 3px solid var(--primary);
    }

    .notification-icon {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--gray-100);
      border-radius: 50%;
    }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-title {
      font-weight: 600;
      color: var(--gray-900);
      margin-bottom: 4px;
      font-size: 14px;
    }

    .notification-message {
      color: var(--gray-700);
      font-size: 13px;
      line-height: 1.4;
      margin-bottom: 4px;
    }

    .notification-time {
      color: var(--gray-500);
      font-size: 11px;
    }

    .notification-actions {
      flex-shrink: 0;
    }

    .mark-read-btn {
      background: none;
      border: 1px solid var(--gray-300);
      color: var(--gray-600);
      width: 24px;
      height: 24px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      transition: all 0.2s;
    }

    .mark-read-btn:hover {
      background: var(--success);
      border-color: var(--success);
      color: white;
    }

    .empty-state {
      text-align: center;
      padding: 48px 20px;
      color: var(--gray-500);
    }

    .empty-icon {
      font-size: 32px;
      margin-bottom: 12px;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
    }

    .dropdown-footer {
      padding: 12px 20px;
      border-top: 1px solid var(--gray-200);
      text-align: center;
    }

    .view-all-btn {
      background: none;
      border: none;
      color: var(--primary);
      font-size: 14px;
      cursor: pointer;
      padding: 8px 16px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .view-all-btn:hover {
      background: var(--primary-light);
    }

    @media (max-width: 480px) {
      .notifications-dropdown {
        width: 320px;
        right: -20px;
      }

      .notification-item {
        padding: 12px 16px;
      }
    }
  `]
})
export class NotificationsPanel implements OnInit {
  open = false;
  items: Notification[] = [];
  count = 0;
  loading = false;
  private destroyRef = inject(DestroyRef);

  constructor(private api: NotificationsService) {}

  ngOnInit() {
    try {
      // Start immediately (0 delay) and poll every 10 seconds
      timer(0, 10000)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.poll());
    } catch (e) {
      console.error('Failed to initialize notifications:', e);
    }
  }

  toggle() {
    this.open = !this.open;
  }

  close() {
    this.open = false;
  }

  poll() {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      
      const userId = JSON.parse(userStr).id;
      this.loading = true;

      this.api.unread(userId).subscribe({
        next: r => {
          this.items = r;
          this.count = r.length;
          this.loading = false;
        },
        error: (e) => {
          console.error('Failed to poll notifications:', e);
          this.items = [];
          this.count = 0;
          this.loading = false;
        }
      });
    } catch (e) {
      console.error('Error in poll:', e);
      this.loading = false;
    }
  }

  markAll() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    const userId = JSON.parse(userStr).id;

    this.api.markAllRead(userId).subscribe({
      next: () => this.poll(),
      error: (e) => console.error('Failed to mark all read:', e)
    });
  }

  markAsRead(notificationId: string) {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    const userId = JSON.parse(userStr).id;

    this.api.markAsRead(notificationId, userId).subscribe({
      next: () => this.poll(),
      error: (e: any) => console.error('Failed to mark as read:', e)
    });
  }

  viewAll() {
    // TODO: Navigate to full notifications page
    console.log('View all notifications clicked');
    this.close();
  }

  getNotificationIcon(type: string): string {
    switch (type?.toLowerCase()) {
      case 'booking': return '📅';
      case 'ticket': return '🔧';
      case 'maintenance': return '⚠️';
      case 'system': return 'ℹ️';
      case 'alert': return '🚨';
      default: return '🔔';
    }
  }

  formatTime(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  }
}
