import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AnalyticsData {
  mostBooked: { name: string; bookings: number }[];
  peakHours: { [key: string]: number };
  utilization: { name: string; type: string; utilization: number }[];
  stats: {
    totalFacilities: number;
    activeFacilities: number;
    inactiveFacilities: number;
    totalBookings: number;
    avgUtilization: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class FacilityAnalyticsService {
  private apiUrl = 'http://localhost:8080/api/facilities/analytics';

  constructor(private http: HttpClient) { }

  getAnalyticsData(): Observable<AnalyticsData> {
    // Combine multiple API calls
    return new Observable(observer => {
      const data: any = {};
      
      this.http.get(`${this.apiUrl}/most-booked`).subscribe({
        next: (res: any) => {
          data.mostBooked = res.mostBooked;
          this.http.get(`${this.apiUrl}/peak-hours`).subscribe({
            next: (res2: any) => {
              data.peakHours = res2.peakHours;
              this.http.get(`${this.apiUrl}/utilization`).subscribe({
                next: (res3: any) => {
                  data.utilization = res3.utilization;
                  this.http.get(`${this.apiUrl}/stats`).subscribe({
                    next: (res4: any) => {
                      data.stats = res4;
                      observer.next(data);
                      observer.complete();
                    },
                    error: (err) => observer.error(err)
                  });
                },
                error: (err) => observer.error(err)
              });
            },
            error: (err) => observer.error(err)
          });
        },
        error: (err) => observer.error(err)
      });
    });
  }
}