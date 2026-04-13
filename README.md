# PAFProject

backend run code = $env:JAVA_HOME = cd c:\Users\Dell\Desktop\smart-campus-ops-hub\backend
>> ./mvnw clean spring-boot:run
front end run code = npm start<!-- login.page.html -->
<div class="login-container">
  <h2>Login to Smart Campus</h2>
  
  <!-- The (ngSubmit) ensures Angular handles the logic, 
       while the <form> allows the browser to see the login context -->
  <form (ngSubmit)="handleLogin()" #loginForm="ngForm">
    <div class="form-group">
      <label for="email">Email Address</label>
      <input
        id="email"
        type="email"
        name="email" 
        [(ngModel)]="credentials.email"
        autocomplete="username email" 
        required
        placeholder="Enter your campus email"
      />
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        name="password"
        [(ngModel)]="credentials.password"
        autocomplete="current-password"
        required
        placeholder="Enter your password"
      />
    </div>

    <button type="submit" [disabled]="!loginForm.valid">
      Sign In
    </button>
  </form>
</div>
