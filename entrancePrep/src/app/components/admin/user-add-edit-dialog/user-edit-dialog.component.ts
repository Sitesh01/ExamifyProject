import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.scss'],
})
export class UserEditDialogComponent {
  userForm: FormGroup;
  roles = ['admin', 'user', 'moderator'];
  title: string = '';
  btnAction: string = '';
  // isEdit: boolean = false;
  passwordConfirm: string = '';
  disableInputs: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UserEditDialogComponent>
  ) {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      isVerified: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    console.log(this.data);
    if (this.data.isEdit) {
      this.title = 'Edit';
      this.btnAction = 'Update';
      this.userForm.controls['username'].setValue(this.data.dataValue.username);
      this.userForm.controls['username'].disable();
      this.userForm.controls['email'].setValue(this.data.dataValue.email);
      this.userForm.controls['email'].disable();
      if (this.data.dataValue.isVerified) {
        this.userForm.controls['isVerified'].setValue('true');
      } else {
        this.userForm.controls['isVerified'].setValue('false');
      }
      this.userForm.controls['isVerified'].disable();
      this.userForm.controls['password'].setValue('********');
      this.userForm.controls['password'].disable();
      this.userForm.controls['role'].setValue(this.data.dataValue.role);
    } else {
      this.title = 'Create';
      this.btnAction = 'Add';
    }
  }

  onSubmit() {
    if (this.data.isEdit) {
      this.authService
        .updateUser(this.data.dataValue.uniqueID, this.userForm.value)
        .subscribe({
          next: (data) => {
            this.dialogRef.close({ value: 'user updated' });
          },
          error: (err) => {
            this._snackBar.open('✖ ' + err.error.message, 'X', {
              duration: 2000,
              panelClass: ['error-snackbar'],
              verticalPosition: 'top',
            });
          },
        });
    } else {
      this.passwordConfirm = this.userForm.value.password;
      this.userForm.value.passwordConfirm = this.passwordConfirm;
      this.authService.createUser(this.userForm.value).subscribe({
        next: (data) => {
          this.dialogRef.close({ value: 'user added' });
        },
        error: (err) => {
          this._snackBar.open('✖ ' + err.error.message, 'X', {
            duration: 2000,
            panelClass: ['error-snackbar'],
            verticalPosition: 'top',
          });
        },
      });
    }
  }


  onCancel() {}
}
