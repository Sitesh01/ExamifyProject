import { Component } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { environment as config } from '../../../../environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  currentUser!: User;
  username: string = '';
  email: string = '';
  profile: any;
  role: string = '';
  createdAt: string = '';
  userId: string = '';

  picUrl = config.picUrl;

  isEditing: boolean = false;
  bindingUsername: string = '';
  bindingEmail: string = '';
  passwordForm: FormGroup;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    this.userId = this.currentUser['data'].user.uniqueID;
    this.passwordForm = this.formBuilder.group({
      passwordCurrent: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.userDetails();
  }

  userDetails() {
    console.log(this.userId);
    this.authService.getCurrentUser(this.userId).subscribe({
      next: (data) => {
        this.currentUser = data.data['user'][0];
        this.username = this.currentUser.username;
        this.email = this.currentUser.email;
        this.profile = `${this.picUrl}/${this.currentUser['photo']}`;
        this.role = this.currentUser['role'];
        this.createdAt = this.currentUser['createdAt'];
        this.userId = this.currentUser['uniqueID'];
        this.apiService.loader.next(false);
      },
      error: (err) => {
        this._snackBar.open('Error fetching user details', 'Close', {
          duration: 2000,
        });
        this.apiService.loader.next(false);
      },
    });
  }

  onEdit() {
    this.isEditing = true;
  }

  onCancel() {
    this.isEditing = false;
  }

  changeUsername() {
    const uname = { username: this.bindingUsername };
    console.log(uname);
    this.authService.updateMe(uname).subscribe({
      next: (data) => {
        this._snackBar.open('Profile updated successfully', 'Close', {
          duration: 2000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
        });

        // this.isEditing = false;
        this.userDetails();
        this.apiService.loader.next(false);
      },
      error: (err) => {
        this._snackBar.open('Error updating profile', 'Close', {
          duration: 2000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
        });
        this.apiService.loader.next(false);
      },
    });
  }

  changeEMail() {
    const email = { email: this.bindingEmail };
    console.log(email);
    this.authService.changeEmail(email).subscribe({
      next: (data) => {
        console.log('Verification of email', data);
        this._snackBar.open(
          'Verification mail has been sent to this email. Please verify.',
          'Close',
          {
            duration: 2000,
            panelClass: ['success-snackbar'],
            verticalPosition: 'top',
          }
        );

        this.userDetails();
        this.apiService.loader.next(false);
      },
      error: (err) => {
        this._snackBar.open('Error updating profile', 'Close', {
          duration: 2000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
        });
        this.apiService.loader.next(false);
      },
    });
  }

  async changePassword() {
    try {
      this.apiService.loader.next(true);
      await this.authService
        .changePassword(this.passwordForm.value)
        .toPromise();
      this._snackBar.open(
        'Password updated successfully. Please login again!',
        'Close',
        {
          duration: 2000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
        }
      );
      await this.authService.logout().toPromise();
      this.router.navigate(['/login']);
      this.apiService.loader.next(false);
    } catch (error) {
      console.log('Error:', error);
    }
  }
}
