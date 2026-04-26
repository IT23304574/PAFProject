import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { BookingsPage } from './features/bookings/bookings.page';
import { TicketsPage } from './features/maintenance/tickets.page';
import { FacilityListComponent } from './features/facility/facility-list/facility-list.component';
import { FacilityFormComponent } from './features/facility/facility-form/facility-form.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { TechnicianApprovalComponent } from './features/admin/technician-approval.component';
import { authGuard, roleGuard } from './core/auth.guards';

export const routes: Routes = [
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '',                   pathMatch: 'full', redirectTo: 'facilities' },
      { path: 'facilities',         component: FacilityListComponent, canActivate: [roleGuard(['ROLE_USER', 'ROLE_ADMIN'])] },
      { path: 'facilities/add',     component: FacilityFormComponent, canActivate: [roleGuard(['ROLE_ADMIN'])] },
      { path: 'facilities/edit/:id',component: FacilityFormComponent, canActivate: [roleGuard(['ROLE_ADMIN'])] },
      { path: 'bookings',           component: BookingsPage, canActivate: [roleGuard(['ROLE_USER', 'ROLE_ADMIN'])] },
      { path: 'ticket',             component: TicketsPage, canActivate: [roleGuard(['ROLE_USER', 'ROLE_TECHNICIAN', 'ROLE_ADMIN'])] },
      { path: 'admin',              component: AdminDashboardComponent, canActivate: [roleGuard(['ROLE_ADMIN'])] },
      { path: 'admin/technicians',  component: TechnicianApprovalComponent, canActivate: [roleGuard(['ROLE_ADMIN'])] },
    ]
  }
];