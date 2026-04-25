import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilityService, Facility } from '../facility.service';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent implements OnInit {
  facilities: Facility[] = [];
  isLoading = true;
  errorMessage = '';

  // Stats
  totalFacilities = 0;
  activeFacilities = 0;
  inactiveFacilities = 0;
  totalCapacity = 0;

  // Chart Data
  facilityTypes: { type: string; count: number; percentage: number }[] = [];
  statusDistribution: { status: string; count: number; percentage: number }[] = [];
  mostBooked: { name: string; bookings: number }[] = [];
  peakHours: { time: string; count: number }[] = [];

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
        this.generateMockAnalytics();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load analytics data';
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
    this.facilityTypes = Array.from(typeMap.entries()).map(([type, count]) => ({
      type,
      count,
      percentage: (count / this.totalFacilities) * 100
    }));

    // Status distribution
    const statusMap = new Map<string, number>();
    this.facilities.forEach(f => {
      statusMap.set(f.status, (statusMap.get(f.status) || 0) + 1);
    });
    this.statusDistribution = Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      count,
      percentage: (count / this.totalFacilities) * 100
    }));
  }

  generateMockAnalytics(): void {
    // Mock most booked facilities data
    this.mostBooked = [
      { name: 'Hall A', bookings: 45 },
      { name: 'Computer Lab 1', bookings: 38 },
      { name: 'Hall B', bookings: 32 },
      { name: 'Meeting Room A', bookings: 25 },
      { name: 'Projector X1', bookings: 18 }
    ];

    // Mock peak hours data
    this.peakHours = [
      { time: '08:00-09:00', count: 12 },
      { time: '09:00-10:00', count: 28 },
      { time: '10:00-11:00', count: 35 },
      { time: '11:00-12:00', count: 42 },
      { time: '12:00-13:00', count: 18 },
      { time: '13:00-14:00', count: 22 },
      { time: '14:00-15:00', count: 38 },
      { time: '15:00-16:00', count: 31 },
      { time: '16:00-17:00', count: 15 }
    ];
  }
}