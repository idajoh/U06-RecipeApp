import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserKey = 'currentUser';  // Key to store the user data
  private usersKey = 'users';  // Key to store all users in localStorage

  constructor(private router: Router) {}

  // Method to sign up a new user
  signup(email: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');  // Get existing users
    if (users.some((user: { email: string }) => user.email === email)) {
      return false;  // Return false if the email is already registered
    }
    // Add the new user
    users.push({ email, password });
    localStorage.setItem(this.usersKey, JSON.stringify(users));  // Save updated user list
    return true;
  }

  // Method to login the user
  login(email: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');  // Get existing users
    const user = users.find(
      (user: { email: string; password: string }) => user.email === email && user.password === password
    );
    if (user) {
      localStorage.setItem(this.currentUserKey, JSON.stringify(user));  // Save the user in local storage
      return true;
    }
    return false;
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.currentUserKey);
  }

  // Get the current user
  getCurrentUser(): string | null {
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user).email : null;
  }

  // Logout the user
  logout(): void {
    localStorage.removeItem(this.currentUserKey);
    this.router.navigate(['/login']);
  }
}
