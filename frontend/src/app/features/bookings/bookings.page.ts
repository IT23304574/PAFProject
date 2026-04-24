import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { BookingsService, Booking } from './bookings.service';
import { FacilityService } from '../facility/facility.service';
import { FacilityAnalyticsService } from '../facility/facility-analytics.service';
import { ToastService } from '../../core/toast.service';

@Component({
  standalone: true,
  selector: 'app-bookings-page',
  imports: [FormsModule, NgFor, NgIf, NgClass],
  template: `
    <div class="page-header">
      <h1>📅 My Bookings</h1>
      <p class="page-subtitle">Manage your resource bookings and reservations</p>
    </div>

    <div class="booking-form-card">
      <h3>📝 Create New Booking</h3>
      <form class="booking-form" (ngSubmit)="create()">
        <div class="form-row">
          <div class="form-group">
            <label for="resourceId">Facility Name</label>
            <select id="resourceId" [(ngModel)]="resourceId" name="resourceId" required>
              <option value="" disabled selected>Select a facility</option>
              <option *ngFor="let res of facilities" [value]="res.id">
                {{ res.name }} ({{ res.type }}) - Capacity: {{ res.capacity }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="startTime">Start Time</label>
            <input
              id="startTime"
              type="datetime-local"
              [(ngModel)]="startTime"
              name="startTime"
              required
            />
          </div>
          <div class="form-group">
            <label for="endTime">End Time</label>
            <input
              id="endTime"
              type="datetime-local"
              [(ngModel)]="endTime"
              name="endTime"
              required
            />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary" [disabled]="!resourceId || !startTime || !endTime">
              Create Booking
            </button>
          </div>
        </div>
      </form>
    </div>

    <div class="bookings-section">
      <div class="section-header">
        <h3>📋 My Bookings</h3>
        <button class="btn-secondary" (click)="load()" [disabled]="loading">
          {{ loading ? 'Loading...' : 'Refresh' }}
        </button>
      </div>

      <div *ngIf="bookings.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">📅</div>
        <h4>No bookings found</h4>
        <p>Create your first booking using the form above.</p>
      </div>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading bookings...</p>
      </div>

      <div class="bookings-grid" *ngIf="bookings.length > 0">
        <div class="booking-card" *ngFor="let booking of bookings">
          <div class="booking-header">
            <div class="booking-resource">
              <strong>{{ getFacilityName(booking.resourceId) }}</strong>
            </div>
            <div class="booking-status" [ngClass]="getStatusClass(booking.status)">
              {{ booking.status }}
            </div>
          </div>
          <div class="booking-details">
            <div class="detail-item">
              <span class="detail-label">Start:</span>
              <span class="detail-value">{{ formatDate(booking.startTime) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">End:</span>
              <span class="detail-value">{{ formatDate(booking.endTime) }}</span>
            </div>
            <div class="detail-item" *ngIf="booking.createdAt">
              <span class="detail-label">Created:</span>
              <span class="detail-value">{{ formatDate(booking.createdAt) }}</span>
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

    .booking-form-card {
      background: white;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 32px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--gray-200);
    }

    .booking-form-card h3 {
      margin: 0 0 20px 0;
      color: var(--gray-900);
      font-size: 20px;
    }

    .booking-form {
      max-width: none;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr auto;
      gap: 16px;
      align-items: end;
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

    .form-group input {
      padding: 10px 12px;
      border: 1px solid var(--gray-300);
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .form-group input:focus, .form-group select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-actions {
      display: flex;
      align-items: end;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
      border: none;
      padding: 10px 20px;
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

    .bookings-section {
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

    .bookings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 16px;
    }

    .booking-card {
      border: 1px solid var(--gray-200);
      border-radius: 8px;
      padding: 16px;
      background: white;
      transition: box-shadow 0.2s;
    }

    .booking-card:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .booking-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .booking-resource {
      font-size: 16px;
      color: var(--gray-900);
    }

    .booking-status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .booking-status.approved {
      background: var(--success-light);
      color: var(--success);
    }

    .booking-status.pending {
      background: var(--warning-light);
      color: var(--warning);
    }

    .booking-status.rejected {
      background: var(--error-light);
      color: var(--error);
    }

    .booking-status.cancelled {
      background: var(--gray-200);
      color: var(--gray-600);
    }

    .booking-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
    }

    .detail-label {
      color: var(--gray-600);
      font-weight: 500;
    }

    .detail-value {
      color: var(--gray-900);
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .bookings-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BookingsPage implements OnInit {
  bookings: Booking[] = [];
  facilities: any[] = [];
  resourceId = '';
  startTime = '';
  endTime = '';
  loading = false;

  constructor(
    public toast: ToastService, 
    private api: BookingsService,
    private facilityService: FacilityService,
    private analyticsService: FacilityAnalyticsService
  ) {}

  ngOnInit() {
    console.log('BookingsPage initialized');
    this.load();
    this.loadFacilities();
  }

  loadFacilities() {
    this.facilityService.getAllFacilities().subscribe({
      next: (r: any[]) => this.facilities = r,
      error: (e: any) => console.error('Failed to load facilities', e)
    });
  }

  load() {
    const userStr = localStorage.getItem('user'); // Get user string from local storage
    if (!userStr) {
      this.toast.show('You must be logged in to view bookings.');
      return;
    }
    const user = JSON.parse(userStr); // Parse user object
    const userId = user.id; // Extract user ID
    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) { // Validate user ID format
      this.toast.show('Invalid user session. Please log in again.');
      // Optionally, force logout here: this.auth.logout(); this.router.navigate(['/login']);
      return;
    }
    console.log('Loading bookings for User ID:', userId);

    this.loading = true;
    this.api.mine(userId).subscribe({
      next: (r: Booking[]) => {
        this.bookings = r;
        this.loading = false;
      },
      error: (e: any) => {
        this.toast.show('Load failed: ' + (e?.error?.detail ?? e?.error?.message ?? e.message));
        this.loading = false;
      }
    });
  }

  create() {
    if (!this.resourceId || !this.startTime || !this.endTime) {
      this.toast.show('Please fill in all fields.');
      return;
    }

    const startDate = new Date(this.startTime);
    const endDate = new Date(this.endTime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      this.toast.show('Invalid date selection.');
      return;
    }

    if (startDate >= endDate) {
      this.toast.show('End time must be after start time.');
      return;
    }

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.toast.show('You must be logged in to create a booking.');
      return;
    }
    const userId = JSON.parse(userStr).id;

    this.toast.show('Creating booking...');

    const start = startDate.toISOString();
    const end = endDate.toISOString();

    this.api.create(this.resourceId, start, end, userId).subscribe({
      next: (booking: Booking) => {
        this.toast.show('Booking created successfully!');
        this.resourceId = '';
        this.startTime = '';
        this.endTime = '';
        this.load();
      },
      error: (e: any) => {
        console.error('Booking creation error:', e);
        const msg = e?.error?.message || e?.error?.detail || e?.message || "An unknown error occurred";
        this.toast.show('Create failed: ' + msg);
      }
    });
  }

  getFacilityName(id: string): string {
    const facility = this.facilities.find(f => f.id === id);
    return facility ? facility.name : id;
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'approved': return 'approved';
      case 'pending': return 'pending';
      case 'rejected': return 'rejected';
      case 'cancelled': return 'cancelled';
      default: return 'pending';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}
