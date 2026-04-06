import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { TicketsService, Ticket } from './tickets.service';
import { ToastService } from '../../core/toast.service';

@Component({
  standalone: true,
  selector: 'app-tickets-page',
  imports: [FormsModule, NgFor, NgIf, NgClass],
  template: `
    <div class="page-header">
      <h1>🔧 Maintenance Tickets</h1>
      <p class="page-subtitle">Report and track maintenance issues across campus</p>
    </div>

    <div class="ticket-form-card">
      <h3>📝 Create New Ticket</h3>
      <form class="ticket-form" (ngSubmit)="create()">
        <div class="form-grid">
          <div class="form-group">
            <label for="resourceId">Resource ID</label>
            <input
              id="resourceId"
              type="text"
              [(ngModel)]="resourceId"
              name="resourceId"
              placeholder="e.g., AUDITORIUM_001, LAB_203"
              required
            />
          </div>

          <div class="form-group">
            <label for="category">Category</label>
            <select [(ngModel)]="category" name="category" required>
              <option value="Maintenance">Maintenance</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Security">Security</option>
              <option value="IT">IT Support</option>
              <option value="Facilities">Facilities</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label for="priority">Priority</label>
            <select [(ngModel)]="priority" name="priority" required>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            [(ngModel)]="description"
            name="description"
            rows="4"
            placeholder="Please describe the issue in detail..."
            required
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" [disabled]="!resourceId || !description">
            Create Ticket
          </button>
        </div>
      </form>
    </div>

    <div class="tickets-section">
      <div class="section-header">
        <h3>📋 My Tickets</h3>
        <button class="btn-secondary" (click)="load()" [disabled]="loading">
          {{ loading ? 'Loading...' : 'Refresh' }}
        </button>
      </div>

      <div *ngIf="tickets.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">🎫</div>
        <h4>No tickets found</h4>
        <p>Create your first maintenance ticket using the form above.</p>
      </div>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading tickets...</p>
      </div>

      <div class="tickets-grid" *ngIf="tickets.length > 0">
        <div class="ticket-card" *ngFor="let ticket of tickets">
          <div class="ticket-header">
            <div class="ticket-info">
              <div class="ticket-id">Ticket #{{ ticket.id }}</div>
              <div class="ticket-resource">{{ ticket.resourceId }}</div>
            </div>
            <div class="ticket-badges">
              <span class="badge priority" [ngClass]="getPriorityClass(ticket.priority)">
                {{ ticket.priority }}
              </span>
              <span class="badge status" [ngClass]="getStatusClass(ticket.status)">
                {{ ticket.status }}
              </span>
            </div>
          </div>

          <div class="ticket-content">
            <div class="ticket-category">
              <strong>{{ ticket.category }}</strong>
            </div>
            <div class="ticket-description">
              {{ ticket.description }}
            </div>
            <div class="ticket-meta" *ngIf="ticket.createdAt">
              <small>Created: {{ formatDate(ticket.createdAt) }}</small>
            </div>
          </div>

          <div class="ticket-actions">
            <div class="file-upload">
              <label class="file-label">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  (change)="onFileSelect(ticket.id, $event)"
                  [disabled]="uploading[ticket.id]"
                />
                <span class="file-button">
                  {{ uploading[ticket.id] ? 'Uploading...' : '📎 Add Evidence' }}
                </span>
              </label>
              <small class="file-hint">PNG/JPG up to 5MB</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      margin-bottom: 32px;
      text-align: center;
    }

    .page-header h1 {
      margin: 0 0 8px 0;
      font-size: 32px;
      color: var(--gray-900);
    }

    .page-subtitle {
      margin: 0;
      color: var(--gray-600);
      font-size: 16px;
    }

    .ticket-form-card {
      background: white;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 32px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--gray-200);
    }

    .ticket-form-card h3 {
      margin: 0 0 20px 0;
      color: var(--gray-900);
      font-size: 20px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 6px;
      font-weight: 500;
      color: var(--gray-700);
      font-size: 14px;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 10px 12px;
      border: 1px solid var(--gray-300);
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-group textarea {
      resize: vertical;
      min-height: 80px;
    }

    .form-actions {
      margin-top: 20px;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--primary-dark);
    }

    .btn-primary:disabled {
      background: var(--gray-400);
      cursor: not-allowed;
    }

    .btn-secondary {
      background: var(--gray-200);
      color: var(--gray-800);
      border: 1px solid var(--gray-300);
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover:not(:disabled) {
      background: var(--gray-300);
    }

    .btn-secondary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .tickets-section {
      background: white;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--gray-200);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h3 {
      margin: 0;
      color: var(--gray-900);
      font-size: 20px;
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: var(--gray-500);
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .empty-state h4 {
      margin: 0 0 8px 0;
      color: var(--gray-700);
    }

    .loading-state {
      text-align: center;
      padding: 48px 24px;
    }

    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--gray-200);
      border-top: 3px solid var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .tickets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 16px;
    }

    .ticket-card {
      border: 1px solid var(--gray-200);
      border-radius: 8px;
      padding: 20px;
      background: white;
      transition: box-shadow 0.2s;
    }

    .ticket-card:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .ticket-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .ticket-info {
      flex: 1;
    }

    .ticket-id {
      font-weight: 600;
      color: var(--gray-900);
      font-size: 16px;
    }

    .ticket-resource {
      color: var(--gray-600);
      font-size: 14px;
      margin-top: 2px;
    }

    .ticket-badges {
      display: flex;
      gap: 8px;
    }

    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge.priority.low {
      background: var(--gray-200);
      color: var(--gray-700);
    }

    .badge.priority.medium {
      background: var(--warning-light);
      color: var(--warning);
    }

    .badge.priority.high {
      background: var(--error-light);
      color: var(--error);
    }

    .badge.priority.urgent {
      background: #fee2e2;
      color: #dc2626;
    }

    .badge.status.open {
      background: var(--primary-light);
      color: var(--primary);
    }

    .badge.status.in-progress {
      background: var(--warning-light);
      color: var(--warning);
    }

    .badge.status.resolved {
      background: var(--success-light);
      color: var(--success);
    }

    .badge.status.closed {
      background: var(--gray-200);
      color: var(--gray-600);
    }

    .ticket-content {
      margin-bottom: 16px;
    }

    .ticket-category {
      margin-bottom: 8px;
      color: var(--gray-900);
    }

    .ticket-description {
      color: var(--gray-700);
      line-height: 1.5;
      margin-bottom: 8px;
    }

    .ticket-meta {
      color: var(--gray-500);
    }

    .ticket-actions {
      border-top: 1px solid var(--gray-200);
      padding-top: 16px;
    }

    .file-upload {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .file-label {
      cursor: pointer;
      display: inline-block;
    }

    .file-label input[type="file"] {
      display: none;
    }

    .file-button {
      display: inline-block;
      padding: 8px 12px;
      background: var(--gray-100);
      color: var(--gray-700);
      border: 1px solid var(--gray-300);
      border-radius: 4px;
      font-size: 14px;
      transition: all 0.2s;
    }

    .file-button:hover {
      background: var(--gray-200);
    }

    .file-hint {
      color: var(--gray-500);
      font-size: 12px;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .tickets-grid {
        grid-template-columns: 1fr;
      }

      .ticket-header {
        flex-direction: column;
        gap: 8px;
      }
    }
  `]
})
export class TicketsPage implements OnInit {
  tickets: Ticket[] = [];
  resourceId = '';
  category = 'Maintenance';
  priority = 'MEDIUM';
  description = '';
  loading = false;
  uploading: { [key: string]: boolean } = {};

  constructor(public toast: ToastService, private api: TicketsService) {}

  ngOnInit() {
    console.log('TicketsPage initialized');
    this.load();
  }

  load() {
    const userStr = localStorage.getItem('user'); // Get user string from local storage
    if (!userStr) {
      this.toast.show('You must be logged in to view tickets.');
      return;
    }
    const user = JSON.parse(userStr); // Parse user object
    const userId = user.id; // Extract user ID
    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) { // Validate user ID format
      this.toast.show('Invalid user session. Please log in again.');
      // Optionally, force logout here: this.auth.logout(); this.router.navigate(['/login']);
      return;
    }
    console.log('Loading tickets for User ID:', userId);

    this.loading = true;
    this.api.mine(userId).subscribe({
      next: r => {
        this.tickets = r;
        this.loading = false;
      },
      error: (e: any) => {
        this.toast.show('Load failed: ' + (e?.error?.detail ?? e?.error?.message ?? e.message));
        this.loading = false;
      }
    });
  }

  create() {
    if (!this.resourceId || !this.description) {
      this.toast.show('Please fill in all required fields.');
      return;
    }

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.toast.show('You must be logged in to create a ticket.');
      return;
    }
    const userId = JSON.parse(userStr).id;

    const payload = {
      resourceId: this.resourceId,
      category: this.category,
      priority: this.priority,
      description: this.description,
      userId: userId
    };

    console.log('Attempting to create ticket:', payload);
    console.log('Sending Ticket Payload:', payload);
    this.toast.show('Creating ticket...');
    
    this.api.create(payload).subscribe({
      next: () => {
        this.toast.show('Ticket created successfully!');
        this.resourceId = '';
        this.category = 'Maintenance';
        this.priority = 'MEDIUM';
        this.description = '';
        this.load();
      },
      error: (e: any) => this.toast.show('Create failed: ' + (e?.error?.detail ?? e?.error?.message ?? e.message))
    });
  }

  onFileSelect(ticketId: string, ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB Limit
      this.toast.show('File is too large. Maximum size is 5MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.toast.show('Please select an image file (PNG or JPG).');
      return;
    }

    console.log(`Attempting to upload file for ticket ${ticketId}:`, file.name, file.size, file.type);
    this.uploading[ticketId] = true;
    this.toast.show('Uploading evidence...');

    this.api.upload(ticketId, file).subscribe({
      next: () => {
        this.toast.show('Evidence uploaded successfully!');
        this.uploading[ticketId] = false;
        input.value = ''; // Clear the file input
        this.load();
      },
      error: (e: any) => {
        this.toast.show('Upload failed: ' + (e?.error?.detail ?? e?.error?.message ?? e.message));
        this.uploading[ticketId] = false;
      }
    });
  }

  getPriorityClass(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'low': return 'low';
      case 'medium': return 'medium';
      case 'high': return 'high';
      case 'urgent': return 'urgent';
      default: return 'medium';
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'open': return 'open';
      case 'in-progress':
      case 'in_progress': return 'in-progress';
      case 'resolved': return 'resolved';
      case 'closed': return 'closed';
      default: return 'open';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}
