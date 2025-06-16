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
    let users: any[] = [];
  
    try {
      const storedUsers = localStorage.getItem(this.usersKey);
      const parsedUsers = JSON.parse(storedUsers || '[]');
  
      if (Array.isArray(parsedUsers)) {
        users = parsedUsers;
      } else {
        console.warn('Users data in localStorage is not an array. Resetting.');
      }
    } catch (e) {
      console.error('Failed to parse users from localStorage:', e);
    }
  
    if (users.some((user: { email: string }) => user.email === email)) {
      return false; // Email already exists
    }
  
    users.push({ email, password });
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    return true;
  }

  // Method to login the user
  login(email: string, password: string): boolean {
    let users: any[] = [];
  
    try {
      const storedUsers = localStorage.getItem(this.usersKey);
      const parsedUsers = JSON.parse(storedUsers || '[]');
  
      if (Array.isArray(parsedUsers)) {
        users = parsedUsers;
      }
    } catch (e) {
      console.error('Failed to parse users from localStorage:', e);
    }
  
    const user = users.find(
      (user: { email: string; password: string }) => user.email === email && user.password === password
    );
  
    if (user) {
      localStorage.setItem(this.currentUserKey, JSON.stringify(user));
      return true;
    }
  
    return false;
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.currentUserKey);
  }

  /*/ Get the current user
  getCurrentUser(): string | null {
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user).email : null;
  }
    */

  getCurrentUser(): string | null {
    const user = localStorage.getItem(this.currentUserKey);
  
    // Kontrollera att strängen verkligen är JSON
    if (!user || user.trim()[0] !== '{') {
      return null;
    }
  
    try {
      return JSON.parse(user).email;
    } catch (e) {
      console.error('Fel vid parsning av currentUser:', e);
      return null;
    }
  }


  // Logout the user
  logout(): void {
    localStorage.removeItem(this.currentUserKey);
    this.router.navigate(['/login']);
  }
}
