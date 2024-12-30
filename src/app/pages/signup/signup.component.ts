import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(public router: Router, private authService: AuthService) {}

  signup(): void {
    if (this.authService.signup(this.email, this.password)) {
      this.router.navigate(['/login']);
    } else {
      this.errorMessage = 'Email already exists!';
    }
  }
}
