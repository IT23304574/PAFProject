import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ResourcesService, Resource } from './resources.service';
import { ToastService } from '../../core/toast.service';

@Component({
  standalone: true,
  selector: 'app-resources',
  imports: [FormsModule, NgFor, NgIf],
  template: `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">📚 Campus Resources</h2>
        <p style="margin: 8px 0 0 0; color: var(--gray-500);">Manage and view available campus facilities</p>
      </div>

      <div class="grid grid-3" style="margin-bottom: 24px;">
        <div class="form-group">
          <label class="form-label">Location</label>
          <input [(ngModel)]="location" placeholder="Filter by location..." />
        </div>
        <div style="display: flex; align-items: flex-end; gap: 8px;">
          <button (click)="load()">🔍 Search</button>
          <button class="secondary" (click)="reset()">Reset</button>
        </div>
      </div>

      <div *ngIf="toast.message" [class]="'alert ' + (toast.message.includes('error') || toast.message.includes('Failed') ? 'alert-error' : 'alert-success')">
        {{toast.message}}
      </div>

      <div class="table-wrapper">
        <table *ngIf="resources.length > 0; else emptyState">
          <thead>
            <tr>
              <th>Type</th>
              <th>Capacity</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of resources">
              <td><strong>{{r.type}}</strong></td>
              <td>{{r.capacity}} seats</td>
              <td>{{r.location}}</td>
              <td>
                <span [class]="'badge badge-' + (r.status === 'AVAILABLE' ? 'success' : 'warning')">
                  {{r.status}}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #emptyState>
          <div class="loading">
            <p>No resources found. Click "Search" to load resources.</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .table-wrapper {
      overflow-x: auto;
    }
  `]
})
export class ResourcesPage implements OnInit {
  resources: Resource[] = [];
  location = '';

  constructor(private api: ResourcesService, public toast: ToastService) {}

  ngOnInit() {
    console.log('ResourcesPage initialized');
  }

  load() {
    this.toast.show('Loading resources...');
    this.api.list({ location: this.location || undefined }).subscribe({
      next: r => {
        this.resources = r;
        this.toast.show(`✅ Loaded ${r.length} resources`);
      },
      error: e => {
        console.error('API Error:', e);
        this.toast.show('❌ Failed to load resources: ' + (e?.error?.detail ?? e.message ?? 'Unknown error'));
      }
    });
  }

  reset() {
    this.location = '';
    this.resources = [];
    this.toast.message = '';
  }
}
