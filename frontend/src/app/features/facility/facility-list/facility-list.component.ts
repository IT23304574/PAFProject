import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FacilityService, Facility } from '../facility.service';

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
    private router: Router
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

  deleteFacility(id: number): void {
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

  // Add new facility
  addFacility(): void {
    this.router.navigate(['/facilities/add']);
  }

  // Edit facility
  editFacility(id: number): void {
    this.router.navigate(['/facilities/edit', id]);
  }
}