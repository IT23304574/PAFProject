import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZoneChangeDetection } from '@angular/core';
import { AppComponent } from './app/root/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideZoneChangeDetection({ eventCoalescing: true })
  ]
}).catch(err => {
  console.error('Bootstrap error:', err);
  document.body.innerHTML = '<h1 style="color:red;">ERROR: ' + err.message + '</h1><pre>' + err.stack + '</pre>';
});