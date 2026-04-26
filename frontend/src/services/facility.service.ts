import axios from 'axios';

const BASE = 'http://localhost:8080/api/facilities';

export interface Facility {
  id?: string;
  name: string;
  type: string;
  capacity: number;
  location: string;
  availableFrom?: string;
  availableTo: string;
  status: string;
}

const api = axios.create({
  headers: { 'Content-Type': 'application/json' }
});

export const facilityService = {
  getAll:          ()                        => api.get<Facility[]>(`${BASE}`),
  getById:         (id: string)              => api.get<Facility>(`${BASE}/${id}`),
  create:          (facility: Facility)      => api.post<Facility>(`${BASE}`, facility),
  update:          (id: string, f: Facility) => api.put<Facility>(`${BASE}/${id}`, f),
  delete:          (id: string)              => api.delete(`${BASE}/${id}`),
  searchByType:    (type: string)            => api.get<Facility[]>(`${BASE}/search/type?type=${type}`),
  searchByLocation:(location: string)        => api.get<Facility[]>(`${BASE}/search/location?location=${location}`),
  getActive:       ()                        => api.get<Facility[]>(`${BASE}/active`),
};