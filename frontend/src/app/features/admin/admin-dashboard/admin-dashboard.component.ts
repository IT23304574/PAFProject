import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FacilityService, Facility } from '../../facility/facility.service';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  facilities: Facility[] = [];
  isLoading = true;
  errorMessage = '';

  // Stats
  totalFacilities = 0;
  activeFacilities = 0;
  inactiveFacilities = 0;
  totalCapacity = 0;

  // Charts data
  facilityTypes: { type: string; count: number }[] = [];
  statusDistribution: { status: string; count: number }[] = [];

  constructor(
    private facilityService: FacilityService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      this.loadData();
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.facilityService.getAllFacilities().subscribe({
      next: (facilities) => {
        this.facilities = facilities;
        this.calculateStats();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load dashboard data';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  calculateStats(): void {
    this.totalFacilities = this.facilities.length;
    this.activeFacilities = this.facilities.filter(f => f.status === 'ACTIVE').length;
    this.inactiveFacilities = this.facilities.filter(f => f.status === 'OUT_OF_SERVICE').length;
    this.totalCapacity = this.facilities.reduce((sum, f) => sum + (f.capacity || 0), 0);

    // Group by type
    const typeMap = new Map<string, number>();
    this.facilities.forEach(f => {
      typeMap.set(f.type, (typeMap.get(f.type) || 0) + 1);
    });
    this.facilityTypes = Array.from(typeMap.entries()).map(([type, count]) => ({ type, count }));

    // Status distribution
    const statusMap = new Map<string, number>();
    this.facilities.forEach(f => {
      statusMap.set(f.status, (statusMap.get(f.status) || 0) + 1);
    });
    this.statusDistribution = Array.from(statusMap.entries()).map(([status, count]) => ({ status, count }));
  }
}