import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FacilityService, Facility } from '../facility.service';
import { AuthService } from '../../../core/auth.service';
import { ExportService, Facility as ExportFacility } from '../../../core/export.service';

@Component({
  selector: 'app-facility-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './facility-list.component.html',
  styleUrls: ['./facility-list.component.css']
})
export class FacilityListComponent implements OnInit {
  facilities: Facility[] = [];
  filteredFacilities: Facility[] = [];
  searchType: string = '';
  searchLocation: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private facilityService: FacilityService,
    private router: Router,
    public authService: AuthService,
    private exportService: ExportService  // 👈 Add this
  ) { }

  ngOnInit(): void {
    this.loadFacilities();
  }

  loadFacilities(): void {
    this.isLoading = true;
    this.facilityService.getAllFacilities().subscribe({
      next: (data) => {
        this.facilities = data;
        this.filteredFacilities = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load facilities';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  searchByType(): void {
    if (this.searchType) {
      this.facilityService.searchByType(this.searchType).subscribe({
        next: (data) => {
          this.filteredFacilities = data;
        },
        error: (err) => {
          this.errorMessage = 'Search failed';
          console.error(err);
        }
      });
    } else {
      this.filteredFacilities = this.facilities;
    }
  }

  searchByLocation(): void {
    if (this.searchLocation) {
      this.facilityService.searchByLocation(this.searchLocation).subscribe({
        next: (data) => {
          this.filteredFacilities = data;
        },
        error: (err) => {
          this.errorMessage = 'Search failed';
          console.error(err);
        }
      });
    } else {
      this.filteredFacilities = this.facilities;
    }
  }

  clearSearch(): void {
    this.searchType = '';
    this.searchLocation = '';
    this.filteredFacilities = this.facilities;
  }

  deleteFacility(id: string): void {
    if (confirm('Are you sure you want to delete this facility?')) {
      this.facilityService.deleteFacility(id).subscribe({
        next: () => {
          this.loadFacilities();
        },
        error: (err) => {
          this.errorMessage = 'Delete failed';
          console.error(err);
        }
      });
    }
  }

  addFacility(): void {
    this.router.navigate(['/facilities/add']);
  }

  editFacility(id: string): void {
    this.router.navigate(['/facilities/edit', id]);
  }

  goToAdminDashboard(): void {
    this.router.navigate(['/admin']);
  }

  private getExportFacilities(): ExportFacility[] {
    return this.filteredFacilities.map((facility) => ({
      id: facility.id ?? '',
      name: facility.name,
      type: facility.type,
      capacity: facility.capacity,
      location: facility.location,
      availableFrom: facility.availableFrom,
      availableTo: facility.availableTo,
      status: facility.status
    }));
  }

  // Export to Excel
  exportToExcel(): void {
    if (this.filteredFacilities.length === 0) {
      this.errorMessage = 'No data to export';
      return;
    }
    this.exportService.exportToExcel(this.getExportFacilities(), 'facilities_export');
  }

  // Export to PDF
  exportToPDF(): void {
    if (this.filteredFacilities.length === 0) {
      this.errorMessage = 'No data to export';
      return;
    }
    this.exportService.exportToPDF(this.getExportFacilities(), 'Facilities Management Report');
  }
}
