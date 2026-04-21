import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { ResourcesPage } from './features/resources/resources.page';
import { BookingsPage } from './features/bookings/bookings.page';
import { TicketsPage } from './features/maintenance/tickets.page';
import { TestPage } from './features/test/test.page';
import { FacilityListComponent } from './features/facility/facility-list/facility-list.component';
import { FacilityFormComponent } from './features/facility/facility-form/facility-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'test', component: TestPage },
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'facilities' },
      { path: 'facilities', component: FacilityListComponent },
      { path: 'facilities/add', component: FacilityFormComponent },
      { path: 'facilities/edit/:id', component: FacilityFormComponent },
      { path: 'resources', component: ResourcesPage },
      { path: 'bookings', component: BookingsPage },
      { path: 'tickets', component: TicketsPage }
    ]
  }
];