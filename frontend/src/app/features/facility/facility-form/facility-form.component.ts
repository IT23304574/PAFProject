import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FacilityService, Facility } from '../facility.service';

@Component({
  selector: 'app-facility-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './facility-form.component.html',
  styleUrls: ['./facility-form.component.css']
})
export class FacilityFormComponent implements OnInit {
  facility: Facility = {
    name: '',
    type: '',
    capacity: 0,
    location: '',
    availableFrom: '08:00:00',
    availableTo: '18:00:00',
    status: 'ACTIVE'
  };
  isEditMode = false;
  facilityId: string | null = null;  // 👈 Changed to string
  isLoading = false;
  errorMessage = '';

  facilityTypes = ['LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT'];
  statusOptions = ['ACTIVE', 'OUT_OF_SERVICE'];

  constructor(
    private facilityService: FacilityService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.facilityId = id;
      this.loadFacility();
    }
  }

  loadFacility(): void {
    this.isLoading = true;
    this.facilityService.getFacilityById(this.facilityId!).subscribe({
      next: (data) => {
        this.facility = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load facility';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (!this.facility.name || !this.facility.type || !this.facility.location) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    this.isLoading = true;
    
    if (this.isEditMode && this.facilityId) {
      this.facilityService.updateFacility(this.facilityId, this.facility).subscribe({
        next: () => {
          this.router.navigate(['/facilities']);
        },
        error: (err) => {
          this.errorMessage = 'Update failed';
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      this.facilityService.createFacility(this.facility).subscribe({
        next: () => {
          this.router.navigate(['/facilities']);
        },
        error: (err) => {
          this.errorMessage = 'Create failed';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/facilities']);
  }
}