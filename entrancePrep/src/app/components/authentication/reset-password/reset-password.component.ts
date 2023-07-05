import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  hidePassword: boolean = true;
  hidePasswordConfirm: boolean = true;
  resetToken: null | undefined;
  resetPasswordForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {
    this.route.params.subscribe((params) => {
      this.resetToken = params['token'];
    });
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  togglePasswordConfirmVisibility() {
    this.hidePasswordConfirm = !this.hidePasswordConfirm;
  }

  submit() {
    this.authService
      .resetPassword(this.resetToken, this.resetPasswordForm.value)
      .subscribe({
        next: (data) => {
          console.log(data);
          this._snackBar.open('✔ Password changed Successfully', 'X', {
            duration: 3000,
            panelClass: ['success-snackbar'],
            verticalPosition: 'top',
          });
          this.apiService.loader.next(false);
          this.router.navigate(['/login']);
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
