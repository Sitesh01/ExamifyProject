import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { VerifyDialogComponent } from '../../common/utilities/verify-dialog/verify-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { DOCUMENT } from '@angular/common';
import { FeedbackBoxComponent } from '../feedback-box/feedback-box.component';
import { QuestionService } from 'src/app/services/question.service';
import { AnswerService } from 'src/app/services/answer.service';

@Component({
  selector: 'app-test-screen',
  templateUrl: './test-screen.component.html',
  styleUrls: ['./test-screen.component.scss'],
})
export class TestScreenComponent {
  questions: any = [];
  answersArr: any = [];
  setNo: any = '';
  subjectFromParams: any = '';

  timer: any = '00:00:00';
  timerInterval: any;

  isSubmitted: boolean = false;
  selectedOptions: string[] = [];
  score: number = 0;

  currentUser!: User;
  userId: any = '';

  //declare like this timePoint = startingTime = 60 * 60;
  timePoint = 60 * 60;
  startingTime = this.timePoint;

  selectedQuestionObj: any = {};
  selectedQuestionIndex: number = 0;

  testArray: any = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private questionApiService: QuestionService,
    private answerApiService: AnswerService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.score = 0;
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    this.userId = this.currentUser['data'].user.uniqueID;
  }

  ngOnInit() {
    this.selectedQuestionIndex = 0;
    this.setNo = this.route.snapshot.paramMap.get('id');
    this.subjectFromParams = this.route.snapshot.paramMap.get('subject');
    this.getQuestionBySetNo();
    this.document.documentElement.requestFullscreen();
    this.document.addEventListener(
      'fullscreenchange',
      this.handleFullscreenChange
    );

    this.startTimer();
  }

  ngOnDestroy() {
    this.document.removeEventListener(
      'fullscreenchange',
      this.handleFullscreenChange
    );
  }

  handleFullscreenChange = () => {
    if (!this.document.fullscreenElement) {
      if (!confirm('Please enable full screen mode')) {
        this.document.documentElement.requestFullscreen();
      }
    }
  };

  answerForm: FormGroup = this.formBuilder.group({
    answer: ['', Validators.required],
  });

  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // swap elements
      this.shuffleArrayOptions(array[i].options); // shuffle options array of each question
    }
  }

  shuffleArrayOptions(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [array[i], array[j]] = [array[j], array[i]]; // swap elements
    }
  }

  getQuestionBySetNo() {
    this.questionApiService
      .getQuestionBySetNo(this.setNo, this.subjectFromParams)
      .subscribe({
        next: (data) => {
          this.questions = data.data.questions;
          console.log(this.questions);
          this.shuffleArray(this.questions);
          this.selectedQuestionObj = this.questions[0];
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

  // defined this function to get testId for current user for feedback submission
  async getTestId() {
    try {
      const data = await this.answerApiService
        .getAnswersBySubject(this.userId, this.subjectFromParams, this.setNo)
        .toPromise();
      this.testArray = data.data.answers[0];
      this.apiService.loader.next(false);
    } catch (error) {
      this._snackBar.open('Error while fetching test ID: ', 'Close', {
        duration: 2000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
      });
      this.apiService.loader.next(false);
    }
  }

  formatTime(time: number) {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time - hours * 3600) / 60);
    let seconds = time - hours * 3600 - minutes * 60;

    return (
      (hours < 10 ? '0' + hours : hours) +
      ':' +
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds : seconds)
    );
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timePoint > 0) {
        this.timePoint--;
        this.timer = this.formatTime(this.timePoint);
      } else {
        clearInterval(this.timerInterval); // clear the interval on time up
        this.timeUp();
      }
    }, 1000);
  }

  onBack() {
    //if test is submitted then go to window history
    if (!this.isSubmitted) {
      this.router.navigate(['/question-sets']);
      //escape from fullscreen mode
      if (this.document.fullscreenElement) {
        this.document.exitFullscreen();
      }
    } else {
      this.dialog
        .open(VerifyDialogComponent, {
          width: '400px',
          data: {
            title: 'go back',
            message: 'You will lose all the progress',
            btnAction: 'Yes',
            taskToDO: 'stopTestGoBack',
          },
        })
        .afterClosed()
        .subscribe((result) => {
          if (result.value === 'stopTestGoBack') {
            this.router.navigate(['/question-sets']);
            //escape from fullscreen mode
            if (this.document.fullscreenElement) {
              this.document.exitFullscreen();
            }
          }
        });
    }
  }

  timeUp() {
    this._snackBar.open('✔ Time up', 'X', {
      duration: 2000,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top',
    });
    this.isSubmitted = true;
  }

  getTimeTaken(startingTime: number, timer: string) {
    const timerParts = timer.split(':').map((part) => parseInt(part, 10));
    const timerSeconds =
      timerParts[0] * 3600 + timerParts[1] * 60 + timerParts[2];
    const elapsedTime = startingTime - timerSeconds;

    if (elapsedTime <= 0) {
      return '00:00:00';
    }
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;
    const hoursString = hours.toString().padStart(2, '0');
    const minutesString = minutes.toString().padStart(2, '0');
    const secondsString = seconds.toString().padStart(2, '0');
    return `${hoursString}:${minutesString}:${secondsString}`;
  }

  // submit the test
  async onSubmit() {
    const timeTakenToSubmit = this.getTimeTaken(this.startingTime, this.timer);

    clearInterval(this.timerInterval); // clear the interval on submit
    let score = 0;

    for (let i = 0; i < this.questions.length; i++) {
      if (this.selectedOptions[i] === this.questions[i].correctAnswer) {
        score++;
      } else {
        this.questions[i].showExplanation = true;
      }
    }

    let submittedAnswers = [];
    let subject;
    let setNo;
    for (let i = 0; i < this.questions.length; i++) {
      subject = this.questions[i].subject;
      setNo = this.questions[i].setNo;
      submittedAnswers.push({
        question: this.questions[i].question,
        questionId: this.questions[i].questionId,
        answer: this.selectedOptions[i],
        correctAnswer: this.questions[i].correctAnswer,
      });
    }

    const result = await this.dialog
      .open(VerifyDialogComponent, {
        width: '400px',
        data: {
          title: 'submit',
          message: 'Once submitted, you cannot edit the answers',
          btnAction: 'Yes',
          taskToDO: 'submitAnswers',
          data: {
            submittedAnswers,
            score,
            subject,
            setNo,
            userId: this.userId,
            timeTakenToSubmit,
          },
        },
      })
      .afterClosed()
      .toPromise();

    if (result.value === 'submitted') {
      this._snackBar.open('✔ Answers submitted successfully', 'X', {
        duration: 2000,
        panelClass: ['success-snackbar'],
        verticalPosition: 'top',
      });
      this.isSubmitted = true;

      this.score = score;
      await this.getTestId();
      this.dialog.open(FeedbackBoxComponent, {
        data: {
          title: 'Feedback',
          message: 'Please provide your feedback',
          btnAction: 'Submit',
          taskToDO: 'submitFeedback',
          dataValue: {
            testId: this.testArray.testId,
          },
        },
      });
    }
  }

  onQuestion(i: number, ques: any) {
    this.selectedQuestionIndex = i;
    this.selectedQuestionObj = ques;
  }

  onNext(i: number) {
    if (i === this.questions.length - 1) {
      return;
    } else {
      this.selectedQuestionIndex = i + 1;
      this.selectedQuestionObj = this.questions[i + 1];
    }
  }

  onPrevious(i: number) {
    this.selectedQuestionIndex = i - 1;
    this.selectedQuestionObj = this.questions[i - 1];
  }

  markForReview(i: number) {
    this.questions[i].isMarkedForReview = !this.questions[i].isMarkedForReview;
  }

  getBackgroundColor(i: number) {
    const question = this.questions[i];
    const isAnswered = this.selectedOptions[i] !== undefined;

    //if question is answered and marked for review then bg color is yellow
    if (isAnswered && question.isMarkedForReview) {
      return '#ffeb3b';
    } else if (isAnswered) {
      return '#4CAF50';
    } else if (question.isMarkedForReview) {
      return '#ff9800';
    } else {
      return '#e0e0e0';
    }
  }

  getBgForAns() {
    const selectedOption = this.selectedOptions[this.selectedQuestionIndex];
    if (selectedOption === this.selectedQuestionObj.correctAnswer) {
      return '#4CAF50';
    } else {
      return '#FF9800';
    }
  }

  getResultBgColor(question: any): string {
    if (question.answer === question.correctAnswer) {
      return '#39aa39';
    } else {
      return '#e74545';
    }
  }
}
