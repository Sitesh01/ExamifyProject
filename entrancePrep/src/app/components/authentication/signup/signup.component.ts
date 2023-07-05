import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  username: string = '';
  passwordConfirm: string = '';

  signupContainer: boolean = true;
  signupForm!: FormGroup;

  emailPattern: string = '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  email: string = '';
  password: string = '';
  hidePassword: boolean = true;
  hidePasswordConfirm: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  togglePasswordConfirmVisibility() {
    this.hidePasswordConfirm = !this.hidePasswordConfirm;
  }

  signup() {
    this.authService.signup(this.signupForm.value).subscribe({
      next: (data) => {
        this._snackBar.open('✔ Signup successfully', 'X', {
          duration: 3000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
        });

        this.signupContainer = false;
        this.apiService.loader.next(false);
      },
      error: (error) => {
        this._snackBar.open(`🚨 ${error.error.message}`, '❌', {
          duration: 3000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
        });
      },
    });
  }
}
