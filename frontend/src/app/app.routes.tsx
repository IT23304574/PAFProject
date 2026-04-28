import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { BookingsPage } from './features/bookings/bookings.page';
import { FacilityListComponent } from './features/facility/facility-list/facility-list.component';
import { FacilityFormComponent } from './features/facility/facility-form/facility-form.component';
import { TicketsPage } from './features/maintenance/tickets.page';
import { Shell } from './layout/shell';

// Placeholder for components not yet converted to React
const Placeholder = ({ name }: { name: string }) => (
  <div style={{ padding: '20px' }}><h1>{name}</h1><p>This component needs to be converted to React.</p></div>
);

export const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginComponent />} />
    <Route path="/register" element={<RegisterComponent />} />
    <Route path="/test" element={<Placeholder name="Test Page" />} />
    
    {/* Main Layout / Shell Wrapper */}
    <Route path="/" element={<Shell />}>
      <Route index element={<Navigate to="/facilities" replace />} />
      <Route path="facilities" element={<FacilityListComponent />} />
      <Route path="facilities/add" element={<FacilityFormComponent />} />
      <Route path="facilities/edit/:id" element={<FacilityFormComponent />} />
      <Route path="bookings" element={<BookingsPage />} />
      <Route path="tickets" element={<TicketsPage />} />
    </Route>

    <Route path="*" element={<Navigate to="/facilities" replace />} />
  </Routes>
);