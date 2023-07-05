import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { DOCUMENT } from '@angular/common';
import { QuestionService } from 'src/app/services/question.service';
import { AnswerService } from 'src/app/services/answer.service';

@Component({
  selector: 'app-see-submitted-answers',
  templateUrl: './see-submitted-answers.component.html',
  styleUrls: ['./see-submitted-answers.component.scss'],
})
export class SeeSubmittedAnswersComponent {
  questions: any = [];
  answersArr: any = [];
  setNoFromParams: any = '';
  subjectFromParams: any = '';

  timer: any = '00:00:00';
  timerInterval: any;

  isSubmitted: boolean = false;
  selectedOptions: string[] = [];
  score: number = 0;

  currentUser!: User;
  userId: any = '';

  viewingRecords: boolean = false;

  checkingAns: boolean = true;

  //declare like this timePoint = startingTime = 60 * 60;
  timePoint = 60 * 60;
  startingTime = this.timePoint;

  selectedQuestionObj: any = {};
  selectedQuestionIndex: number = 0;

  viewingRecord: boolean = false;

  testArray: any = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private answerApiService: AnswerService
  ) {
    this.score = 0;
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    this.userId = this.currentUser['data'].user.uniqueID;
  }

  ngOnInit(): void {
    this.setNoFromParams = this.route.snapshot.paramMap.get('id');
    this.subjectFromParams = this.route.snapshot.paramMap.get('subject');
    this.getQuestionBySubject();
  }

  getQuestionBySubject() {
    this.answerApiService
      .getAnswersBySubject(
        this.userId,
        this.subjectFromParams,
        this.setNoFromParams
      )
      .subscribe({
        next: (data) => {
          this.answersArr = data.data.answers[0];
          this.questions = data.data.answers[0].submittedAnswers;
          this.score = this.answersArr.score;
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

  onBack() {
    window.history.back();
  }

  getResultBgColor(question: any): string {
    if (question.answer === question.correctAnswer) {
      return '#39aa39';
    } else {
      return '#e74545';
    }
  }
}
