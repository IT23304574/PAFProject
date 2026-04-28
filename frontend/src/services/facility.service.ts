import axios from 'axios';

const API_URL = 'http://localhost:8080/api/facilities';  // No trailing slash

export interface Facility {
  id?: string;
  name: string;
  type: string;
  capacity: number;
  location: string;
  availableFrom: string;
  availableTo: string;
  status: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const facilityService = {
  getAll: () => api.get<Facility[]>(''),  // Empty string, not '/'
  getById: (id: string) => api.get<Facility>(`/${id}`),
  create: (facility: Facility) => api.post<Facility>('', facility),  // Empty string, not '/'
  update: (id: string, facility: Facility) => api.put<Facility>(`/${id}`, facility),
  delete: (id: string) => api.delete(`/${id}`),
  searchByType: (type: string) => api.get<Facility[]>(`/search/type?type=${type}`),
  searchByLocation: (location: string) => api.get<Facility[]>(`/search/location?location=${location}`),
  getActive: () => api.get<Facility[]>('/active')
};