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
    <h2>Resources</h2>

    <div style="display:flex; gap:12px; margin-bottom:12px;">
      <input [(ngModel)]="location" placeholder="Filter by location" />
      <button (click)="load()">Search</button>
    </div>

    <div *ngIf="toast.message" style="margin-bottom:12px; border:1px solid #eee; padding:10px;">
      {{toast.message}}
    </div>

    <table border="1" cellpadding="6" style="width:100%; border-collapse:collapse;">
      <tr><th>Type</th><th>Capacity</th><th>Location</th><th>Status</th><th>Id</th></tr>
      <tr *ngFor="let r of resources">
        <td>{{r.type}}</td>
        <td>{{r.capacity}}</td>
        <td>{{r.location}}</td>
        <td>{{r.status}}</td>
        <td><code>{{r.id}}</code></td>
      </tr>
    </table>
  `
})
export class ResourcesPage implements OnInit {
  resources: Resource[] = [];
  location = '';

  constructor(private api: ResourcesService, public toast: ToastService) {}

  ngOnInit() {
    console.log('ResourcesPage initialized');
    // API call removed - will be called on demand
  }

  load() {
    try {
      this.api.list({ location: this.location || undefined }).subscribe({
        next: r => {
          this.resources = r;
          console.log('Loaded resources:', r);
        },
        error: e => {
          console.error('API Error:', e);
          this.toast.show('Failed to load resources: ' + (e?.error?.detail ?? e.message ?? 'Unknown error'));
        }
      });
    } catch (e) {
      console.error('Load error:', e);
    }
  }
}
