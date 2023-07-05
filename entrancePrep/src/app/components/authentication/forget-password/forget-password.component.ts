import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent {
  emailPattern: string = '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  email: string = '';
  forgetPasswordForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.forgetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    });
  }

  submit() {
    this.authService.forgotPassword(this.forgetPasswordForm.value).subscribe({
      next: (data) => {
        console.log(data);
        this._snackBar.open('✔ Password reset link sent to your email', 'X', {
          duration: 3000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
        });
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
