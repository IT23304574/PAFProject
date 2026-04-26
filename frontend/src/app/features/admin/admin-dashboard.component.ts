import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../core/api';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h2 class="page-title">⚙️ Admin Dashboard</h2>
          <p class="page-subtitle">System overview and management</p>
        </div>
        <a routerLink="/admin/technicians" class="btn-primary">Manage Technicians</a>
      </div>

      <div *ngIf="pendingCount > 0" class="alert-banner">
        ⏳ <strong>{{ pendingCount }}</strong> technician(s) pending approval.
        <a routerLink="/admin/technicians">Review now →</a>
      </div>

      <div class="kpi-grid" *ngIf="stats">
        <div class="kpi-card total">
          <span class="kpi-icon">🎫</span>
          <div>
            <div class="kpi-value">{{ stats.total }}</div>
            <div class="kpi-label">Total Tickets</div>
          </div>
        </div>
        <div class="kpi-card open">
          <span class="kpi-icon">📬</span>
          <div>
            <div class="kpi-value">{{ stats.open }}</div>
            <div class="kpi-label">Open / In Progress</div>
          </div>
        </div>
        <div class="kpi-card resolved">
          <span class="kpi-icon">✅</span>
          <div>
            <div class="kpi-value">{{ stats.closed }}</div>
            <div class="kpi-label">Resolved / Closed</div>
          </div>
        </div>
        <div class="kpi-card time">
          <span class="kpi-icon">⏱️</span>
          <div>
            <div class="kpi-value">{{ stats.avgResolutionHours }}h</div>
            <div class="kpi-label">Avg Resolution Time</div>
          </div>
        </div>
      </div>

      <div class="charts-row" *ngIf="stats">
        <div class="chart-card">
          <h4>Tickets by Status</h4>
          <div class="bar-chart">
            <div *ngFor="let item of statusItems" class="bar-item">
              <div class="bar-label">{{ item.key }}</div>
              <div class="bar-track">
                <div class="bar-fill" [ngClass]="item.key"
                     [style.width.%]="barPct(item.val, stats.total)"></div>
              </div>
              <div class="bar-val">{{ item.val }}</div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h4>Tickets by Priority</h4>
          <div class="bar-chart">
            <div *ngFor="let item of priorityItems" class="bar-item">
              <div class="bar-label">{{ item.key }}</div>
              <div class="bar-track">
                <div class="bar-fill" [ngClass]="item.key"
                     [style.width.%]="barPct(item.val, stats.total)"></div>
              </div>
              <div class="bar-val">{{ item.val }}</div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h4>Tickets by Category</h4>
          <div class="bar-chart">
            <div *ngFor="let item of categoryItems" class="bar-item">
              <div class="bar-label">{{ item.key }}</div>
              <div class="bar-track">
                <div class="bar-fill cat" [style.width.%]="barPct(item.val, stats.total)"></div>
              </div>
              <div class="bar-val">{{ item.val }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-card" *ngIf="stats">
        <div class="section-header">
          <h4>Recent Tickets</h4>
          <a routerLink="/ticket" class="link-sm">View All →</a>
        </div>
        <table>
          <thead>
            <tr><th>ID</th><th>Category</th><th>Priority</th><th>Status</th><th>Description</th><th>Date</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of stats.recentTickets">
              <td class="mono">#{{ t.id?.slice(-6) }}</td>
              <td>{{ t.category }}</td>
              <td><span class="badge" [ngClass]="t.priority">{{ t.priority }}</span></td>
              <td><span class="badge status" [ngClass]="t.status?.replace('_','')">{{ t.status }}</span></td>
              <td>{{ t.description }}</td>
              <td>{{ t.createdAt | date:'dd MMM' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="loading" class="loading-state">Loading dashboard…</div>
    </div>
  `,
  styles: [`
    .page-wrapper { max-width: 1200px; margin: 0 auto; padding: 0 16px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
    .page-title { font-size: 24px; font-weight: 700; color: #1f2937; margin: 0; }
    .page-subtitle { font-size: 14px; color: #6b7280; margin: 4px 0 0; }

    .alert-banner { background: #fef3c7; border: 1px solid #fcd34d; color: #92400e; border-radius: 10px; padding: 12px 20px; margin-bottom: 20px; font-size: 14px; }
    .alert-banner a { color: #92400e; font-weight: 600; margin-left: 8px; }

    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .kpi-card { background: white; border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 16px; border: 1px solid #e5e7eb; }
    .kpi-card.total    { border-left: 4px solid #6366f1; }
    .kpi-card.open     { border-left: 4px solid #f59e0b; }
    .kpi-card.resolved { border-left: 4px solid #10b981; }
    .kpi-card.time     { border-left: 4px solid #3b82f6; }
    .kpi-icon  { font-size: 32px; }
    .kpi-value { font-size: 28px; font-weight: 700; color: #1f2937; line-height: 1; }
    .kpi-label { font-size: 13px; color: #6b7280; margin-top: 4px; }

    .charts-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .chart-card { background: white; border-radius: 12px; padding: 20px; border: 1px solid #e5e7eb; }
    .chart-card h4 { margin: 0 0 16px; font-size: 15px; color: #374151; }
    .bar-chart { display: flex; flex-direction: column; gap: 10px; }
    .bar-item  { display: flex; align-items: center; gap: 10px; font-size: 13px; }
    .bar-label { width: 110px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-shrink: 0; }
    .bar-track { flex: 1; background: #f3f4f6; border-radius: 999px; height: 10px; overflow: hidden; }
    .bar-fill  { height: 100%; border-radius: 999px; transition: width .4s; background: #6366f1; min-width: 4px; }
    .bar-fill.OPEN        { background: #f59e0b; }
    .bar-fill.IN_PROGRESS { background: #3b82f6; }
    .bar-fill.RESOLVED    { background: #10b981; }
    .bar-fill.CLOSED      { background: #9ca3af; }
    .bar-fill.REJECTED    { background: #ef4444; }
    .bar-fill.URGENT  { background: #dc2626; }
    .bar-fill.HIGH    { background: #f97316; }
    .bar-fill.MEDIUM  { background: #f59e0b; }
    .bar-fill.LOW     { background: #6b7280; }
    .bar-fill.cat     { background: #8b5cf6; }
    .bar-val { min-width: 24px; text-align: right; font-weight: 600; color: #374151; }

    .section-card { background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; margin-bottom: 24px; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .section-header h4 { margin: 0; font-size: 16px; }
    .link-sm { font-size: 13px; color: #1f5eff; text-decoration: none; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
    th { font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; }
    .mono { font-family: monospace; color: #9ca3af; }

    .badge { padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
    .badge.LOW      { background: #f3f4f6; color: #374151; }
    .badge.MEDIUM   { background: #fef3c7; color: #92400e; }
    .badge.HIGH     { background: #fee2e2; color: #991b1b; }
    .badge.URGENT   { background: #dc2626; color: white; }
    .badge.status.OPEN        { background: #fef3c7; color: #92400e; }
    .badge.status.INPROGRESS  { background: #dbeafe; color: #1e40af; }
    .badge.status.RESOLVED    { background: #d1fae5; color: #065f46; }
    .badge.status.CLOSED      { background: #f3f4f6; color: #374151; }
    .badge.status.REJECTED    { background: #fee2e2; color: #991b1b; }

    .btn-primary { background: #1f5eff; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; }
    .loading-state { text-align: center; padding: 60px; color: #6b7280; }
    @media(max-width:600px){ .charts-row{ grid-template-columns:1fr; } .kpi-grid{ grid-template-columns:1fr 1fr; } }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: any = null;
  loading = true;
  pendingCount = 0;

  get statusItems(): { key: string; val: number }[] {
    const s = this.stats?.byStatus || {};
    return Object.entries(s).map(([k, v]) => ({ key: k, val: v as number }));
  }
  get priorityItems(): { key: string; val: number }[] {
    const s = this.stats?.byPriority || {};
    return Object.entries(s).map(([k, v]) => ({ key: k, val: v as number }));
  }
  get categoryItems(): { key: string; val: number }[] {
    const s = this.stats?.byCategory || {};
    return Object.entries(s).map(([k, v]) => ({ key: k, val: v as number }));
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStats();
    this.loadPendingCount();
  }

  loadStats() {
    this.http.get<any>(`${API_BASE}/admin/tickets/stats`).subscribe({
      next: s => { this.stats = s; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  loadPendingCount() {
    this.http.get<any[]>(`${API_BASE}/admin/technicians/pending`).subscribe({
      next: list => this.pendingCount = list.length,
      error: () => {}
    });
  }

  barPct(val: number, total: number): number {
    if (!total) return 0;
    return Math.round((val / total) * 100);
  }
}