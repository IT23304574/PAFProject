import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Provides the routing capabilities to the application
    provideRouter(routes),
    // Provides the HttpClient and registers the authInterceptor
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};