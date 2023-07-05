import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AnswerService } from 'src/app/services/answer.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { BlogService } from 'src/app/services/blog.service';
import { CommentService } from 'src/app/services/comment.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-verify-dialog',
  templateUrl: './verify-dialog.component.html',
  styleUrls: ['./verify-dialog.component.scss'],
})
export class VerifyDialogComponent {
  title: string = '';
  message: string = '';
  btnAction: string = '';
  taskToDO: string = '';
  dataValue: any = {};

  constructor(
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VerifyDialogComponent>,
    private apiService: ApiService,
    private authService: AuthService,
    private feedbackApiService: FeedbackService,
    private blogApiService: BlogService,
    private commentApiService: CommentService,
    private questionApiService: QuestionService,
    private answerApiService: AnswerService
  ) {}

  ngOnInit(): void {
    this.title = this.data.title;
    this.message = this.data.message;
    this.btnAction = this.data.btnAction;
    this.taskToDO = this.data.taskToDO;
    this.dataValue = this.data.data;
  }

  public btnClicked() {
    let element: any = {};
    if (this.taskToDO === 'deleteBlog') {
      this.blogApiService.deleteBlog(this.data.id).subscribe({
        next: (res) => {
          element['value'] = 'deleted';
          this.dialogRef.close(element);
          this.apiService.loader.next(false);
        },
        error: (err) => {
          this._snackBar.open('✗ ' + err.error.message, 'X', {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          });
        },
      });
    } else if (this.taskToDO === 'goBack') {
      window.history.back();
    } else if (this.taskToDO === 'stopTestGoBack') {
      element['value'] = 'stopTestGoBack';
      this.dialogRef.close(element);
    } else if (this.taskToDO === 'submitAnswers') {
      console.log(this.dataValue);
      this.answerApiService
        .submitAnswer(this.dataValue, this.dataValue.userId)
        .subscribe({
          next: (res) => {
            element['value'] = 'submitted';
            this.dialogRef.close(element);
            this.apiService.loader.next(false);
          },
          error: (err) => {
            this._snackBar.open('✗ ' + err.error.message, 'X', {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['error-snackbar'],
            });
          },
        });
    } else if (this.taskToDO === 'timeUp') {
      element['value'] = 'timeUp';
      this.dialogRef.close(element);
    } else if (this.taskToDO === 'submitAnswers') {
      // this.apiService.submitAnswers()
    } else if (this.taskToDO === 'resetPreviousRecord') {
      this.answerApiService
        .deleteSetRecordsByUserIdAndSubject(
          this.dataValue.userId,
          this.dataValue.subject,
          this.dataValue.setNo
        )
        .subscribe({
          next: (data) => {
            element['value'] = 'resettedRecord';
            this.dialogRef.close(element);
            this.apiService.loader.next(false);
          },
          error: (error) => {
            this._snackBar.open(error.error.message, 'Close', {
              duration: 2000,
              panelClass: ['error-snackbar'],
              verticalPosition: 'top',
            });
          },
        });
    } else if (this.taskToDO == 'deleteUser') {
      this.authService.deleteUser(this.data.dataValue).subscribe({
        next: (data) => {
          element['value'] = 'user deleted';
          this.dialogRef.close(element);
          this.apiService.loader.next(false);
        },
        error: (error) => {
          this._snackBar.open(error.error.message, 'Close', {
            duration: 2000,
            panelClass: ['error-snackbar'],
            verticalPosition: 'top',
          });
        },
      });
    } else if (this.taskToDO == 'deleteQuestion') {
      this.questionApiService.deleteQuestion(this.data.ques_id).subscribe({
        next: (data) => {
          element['value'] = 'question deleted';
          this.dialogRef.close(element);
          this.apiService.loader.next(false);
        },
        error: (error) => {
          this._snackBar.open(error.error.message, 'Close', {
            duration: 2000,
            panelClass: ['error-snackbar'],
            verticalPosition: 'top',
          });
        },
      });
    }
  }
}
