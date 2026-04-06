import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { ResourcesPage } from './features/resources/resources.page';
import { BookingsPage } from './features/bookings/bookings.page';
import { TicketsPage } from './features/maintenance/tickets.page';
import { TestPage } from './features/test/test.page';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'test', component: TestPage },
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'test' },
      { path: 'resources', component: ResourcesPage },
      { path: 'bookings', component: BookingsPage },
      { path: 'tickets', component: TicketsPage }
    ]
  }
];
