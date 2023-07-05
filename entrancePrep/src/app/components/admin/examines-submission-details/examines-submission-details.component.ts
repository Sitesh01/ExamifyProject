import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AnswerService } from 'src/app/services/answer.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-examines-submission-details',
  templateUrl: './examines-submission-details.component.html',
  styleUrls: ['./examines-submission-details.component.scss'],
})
export class ExaminesSubmissionDetailsComponent {
  testId: any;
  examines: any = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private answerApiService: AnswerService,
    private apiService: ApiService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.testId = params['testId'];
    });
    this.getRecentExamines();
  }

  getRecentExamines() {
    this.answerApiService.getExaminesDetails(this.testId).subscribe({
      next: (data) => {
        this.examines = data.data.answers[0];
        console.log(this.examines);
        this.apiService.loader.next(false);
      },
      error: (error) => {
        this._snackBar.open(error.error.message, 'Close', {
          duration: 2000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
        });
        this.apiService.loader.next(false);
      },
    });
  }
}
