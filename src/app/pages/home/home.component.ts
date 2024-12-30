import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isLoggedIn: boolean = false;
  currentUser: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus(); 
  }

  // Check if user is logged in
  checkLoginStatus(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isLoggedIn = this.authService.isAuthenticated(); // 
    
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']); 
    }
  }

  // Logout method
  logout(): void {
    this.authService.logout(); 
    this.isLoggedIn = false; 
    this.router.navigate(['/login']); 
  }
}
