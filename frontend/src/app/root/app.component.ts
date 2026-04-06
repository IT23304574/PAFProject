import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <div style="padding: 20px; font-family: system-ui;">
      <h1>Smart Campus Ops Hub - App Loaded!</h1>
      <p>Router outlet below:</p>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  constructor() {
    console.log('AppComponent constructed');
  }
}

