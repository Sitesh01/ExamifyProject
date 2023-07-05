import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-feedback-box',
  templateUrl: './feedback-box.component.html',
  styleUrls: ['./feedback-box.component.scss'],
})
export class FeedbackBoxComponent {
  title: string = '';
  message: string = '';
  btnAction: string = '';
  taskToDO: string = '';
  dataValue: any = {};

  userId: string = '';
  testId: string = '';
  currentUser!: User;

  constructor(
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FeedbackBoxComponent>,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private feedbackApiService: FeedbackService
  ) {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
  }

  ngOnInit(): void {
    this.title = this.data.title;
    this.message = this.data.message;
    this.btnAction = this.data.btnAction;
    this.taskToDO = this.data.taskToDO;
    this.dataValue = this.data.dataValue;
    this.userId = this.currentUser['data'].user.uniqueID;
  }

  feedbackForm: FormGroup = this.formBuilder.group({
    feedback: ['', Validators.required],
  });

  onClose() {
    this.dialogRef.close();
  }

  submitFeedback() {
    this.feedbackApiService
      .submitFeedback(
        this.feedbackForm.value,
        this.userId,
        this.dataValue.testId
      )
      .subscribe({
        next: (data) => {
          this._snackBar.open('✓ ' + 'Feedback submitted successfully', 'X', {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['success-snackbar'],
          });

          console.log('feedback submitted successfully', data);
          this.dialogRef.close();
          this.apiService.loader.next(false);
        },
        error: (error) => {
          this._snackBar.open('✗ ' + error.error.message, 'X', {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          });
          this.apiService.loader.next(false);
        },
      });
  }
}
