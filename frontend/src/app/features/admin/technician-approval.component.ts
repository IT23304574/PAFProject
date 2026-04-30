import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../core/toast.service';
import { API_BASE } from '../../core/api';

interface Technician {
  id: string;
  fullName: string;
  username: string;
  phone?: string;
  department?: string;
  approvalStatus: string;
  role: string;
}

@Component({
  standalone: true,
  selector: 'app-technician-approval',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <a routerLink="/admin" class="back-link">← Back to Dashboard</a>
          <h2 class="page-title">👷 Technician Management</h2>
          <p class="page-subtitle">Approve or reject technician registrations</p>
        </div>
      </div>

      <!-- ── Pending approvals ──────────────────────────────────────────── -->
      <div class="section-card">
        <h4>Pending Approvals ({{ pending.length }})</h4>
        <div *ngIf="pending.length === 0" class="empty-msg">No pending approvals 🎉</div>
        <table *ngIf="pending.length > 0">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Dept</th><th>Phone</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of pending">
              <td><strong>{{ t.fullName }}</strong></td>
              <td>{{ t.username }}</td>
              <td>{{ t.department || '—' }}</td>
              <td>{{ t.phone || '—' }}</td>
              <td>
                <div class="action-btns">
                  <button (click)="approve(t)" class="btn-success">✓ Approve</button>
                  <button (click)="reject(t)"  class="btn-danger">✕ Reject</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── All technicians ────────────────────────────────────────────── -->
      <div class="section-card">
        <h4>All Technicians ({{ all.length }})</h4>
        <div *ngIf="all.length === 0" class="empty-msg">No technicians registered yet.</div>
        <table *ngIf="all.length > 0">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Dept</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of all">
              <td><strong>{{ t.fullName }}</strong></td>
              <td>{{ t.username }}</td>
              <td>{{ t.department || '—' }}</td>
              <td>
                <span class="badge" [ngClass]="statusCls(t.approvalStatus)">
                  {{ t.approvalStatus }}
                </span>
              </td>
              <td>
                <div class="action-btns">
                  <button *ngIf="t.approvalStatus !== 'APPROVED'"
                          (click)="approve(t)" class="btn-success sm">Approve</button>
                  <button *ngIf="t.approvalStatus === 'APPROVED'"
                          (click)="reject(t)"  class="btn-danger sm">Revoke</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-wrapper { max-width: 1000px; margin: 0 auto; padding: 0 16px; }
    .page-header { margin-bottom: 24px; }
    .back-link { font-size: 13px; color: #1f5eff; text-decoration: none; display: block; margin-bottom: 8px; }
    .page-title { font-size: 24px; font-weight: 700; color: #1f2937; margin: 0; }
    .page-subtitle { font-size: 14px; color: #6b7280; margin: 4px 0 0; }

    .section-card { background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; margin-bottom: 20px; }
    .section-card h4 { margin: 0 0 16px; font-size: 16px; color: #374151; }
    .empty-msg { color: #9ca3af; font-size: 14px; padding: 12px 0; }

    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
    th { font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; }

    .action-btns { display: flex; gap: 8px; }
    .btn-success { background: #10b981; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-size: 13px; cursor: pointer; font-weight: 500; }
    .btn-success:hover { background: #059669; }
    .btn-success.sm { padding: 4px 10px; font-size: 12px; }
    .btn-danger  { background: #ef4444; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-size: 13px; cursor: pointer; font-weight: 500; }
    .btn-danger:hover { background: #dc2626; }
    .btn-danger.sm { padding: 4px 10px; font-size: 12px; }

    .badge { padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
    .badge.approved { background: #d1fae5; color: #065f46; }
    .badge.pending  { background: #fef3c7; color: #92400e; }
    .badge.rejected { background: #fee2e2; color: #991b1b; }
  `]
})
export class TechnicianApprovalComponent implements OnInit {
  pending: Technician[] = [];
  all:     Technician[] = [];

  constructor(private http: HttpClient, private toast: ToastService) {}

  ngOnInit() { this.load(); }

  load() {
    this.http.get<Technician[]>(`${API_BASE}/admin/technicians/pending`).subscribe(
      list => this.pending = list
    );
    this.http.get<Technician[]>(`${API_BASE}/admin/technicians`).subscribe(
      list => this.all = list
    );
  }

  approve(t: Technician) {
    this.http.put(`${API_BASE}/admin/technicians/${t.id}/approve`, {}).subscribe({
      next: () => { this.toast.show(`${t.fullName} approved!`); this.load(); },
      error: () => this.toast.show('Action failed')
    });
  }

  reject(t: Technician) {
    this.http.put(`${API_BASE}/admin/technicians/${t.id}/reject`, {}).subscribe({
      next: () => { this.toast.show(`${t.fullName} rejected/revoked`); this.load(); },
      error: () => this.toast.show('Action failed')
    });
  }

  statusCls(s: string) {
    if (s === 'APPROVED') return 'approved';
    if (s === 'REJECTED') return 'rejected';
    return 'pending';
  }
}