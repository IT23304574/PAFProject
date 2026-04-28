import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../core/api';
import { Observable } from 'rxjs';

export type ResourceType = 'LECTURE_HALL' | 'LAB' | 'EQUIPMENT' | 'ROOM';
export type ResourceStatus = 'AVAILABLE' | 'OUT_OF_SERVICE';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  capacity: number;
  location: string;
  status: ResourceStatus;
}

@Injectable({ providedIn: 'root' })
export class ResourcesService {
  constructor(private http: HttpClient) {}

  all(): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${API_BASE}/resources`);
  }

  list(params?: { type?: ResourceType; location?: string }) {
    return this.http.get<Resource[]>(`${API_BASE}/resources`, { params: params as any });
  }
}
