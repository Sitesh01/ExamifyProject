import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  returnUrl: string = '';

  emailPattern: string = '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  email: string = '';
  password: string = '';
  hidePassword: boolean = true;
  loginForm!: FormGroup;

  currentUser!: User;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private apiService: ApiService
  ) {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (data) => {
        console.log('Logged in user data: ', data);
        const token = data.token;
        this.authService.isLoggedIn(token);
        this._snackBar.open('✔ Login successfully', 'X', {
          duration: 3000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
        });
        if (data.data.user.role === 'admin' || data.data.user.role === 'moderator') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
        this.apiService.loader.next(false);
      },
      error: (error) => {
        this._snackBar.open(`🚨 ${error.error.message}`, '❌', {
          duration: 3000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
        });
        this.apiService.loader.next(false);
      },
    });
  }
}
