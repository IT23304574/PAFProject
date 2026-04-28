import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Facility {
  id?: string;  // 👈 Changed from number to string (MongoDB ObjectId)
  name: string;
  type: string;
  capacity: number;
  location: string;
  availableFrom: string;
  availableTo: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  private apiUrl = 'http://localhost:8080/api/facilities';

  constructor(private http: HttpClient) { }

  getAllFacilities(): Observable<Facility[]> {
    return this.http.get<Facility[]>(this.apiUrl);
  }

  getFacilityById(id: string): Observable<Facility> {
    return this.http.get<Facility>(`${this.apiUrl}/${id}`);
  }

  createFacility(facility: Facility): Observable<Facility> {
    return this.http.post<Facility>(this.apiUrl, facility);
  }

  updateFacility(id: string, facility: Facility): Observable<Facility> {
    return this.http.put<Facility>(`${this.apiUrl}/${id}`, facility);
  }

  deleteFacility(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchByType(type: string): Observable<Facility[]> {
    return this.http.get<Facility[]>(`${this.apiUrl}/search/type?type=${type}`);
  }

  searchByLocation(location: string): Observable<Facility[]> {
    return this.http.get<Facility[]>(`${this.apiUrl}/search/location?location=${location}`);
  }

  getActiveFacilities(): Observable<Facility[]> {
    return this.http.get<Facility[]>(`${this.apiUrl}/active`);
  }
}