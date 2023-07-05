import { Component } from '@angular/core';
import { AnswerService } from 'src/app/services/answer.service';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';
import { QuestionService } from 'src/app/services/question.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent {
  currentUser!: User;
  userId = '';

  dataList: any = [];
  sets: any = [];
  subjects: any = [];
  upcomingSets: any = [];
  questions: any = [];
  upcomingQuestionsList: any = [];

  constructor(
    private answerApiService: AnswerService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private apiService: ApiService,
    private questionApiService: QuestionService,
    private router: Router
  ) {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
  }

  ngOnInit(): void {
    this.userId = this.currentUser['data'].user.uniqueID;
    this.getUserProgress();
    this.getQuestions();
    this.upcomingQuestions();
  }

  // User Progress from saved answers
  getUserProgress() {
    this.answerApiService.getUserProgress(this.userId).subscribe({
      next: (data) => {
        this.dataList = data.data.data.map((item: { percentage: number }) => {
          let suggestion = '';
          if (item.percentage < 50) {
            suggestion =
              'You need to study more. Try to improve your performance by reviewing your notes and seeking help from your teacher or tutor.';
          } else if (item.percentage >= 50 && item.percentage < 70) {
            suggestion =
              'You are making progress, but you could still improve. Focus on strengthening your weak areas and practicing more.';
          } else if (item.percentage >= 70 && item.percentage < 90) {
            suggestion =
              'Great job! You are doing well. Keep up the good work and aim to maintain or improve your performance.';
          } else {
            suggestion =
              'Excellent work! You are doing exceptionally well. Keep up the great work and challenge yourself to aim even higher.';
          }
          return {
            ...item,
            percentageWithSymbol: Math.floor(item.percentage) + '%',
            suggestion,
          };
        });
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

  upcomingQuestions() {
    this.questionApiService.getUpcomingQuestions().subscribe({
      next: (data) => {
        const questionsList = Object.values(data.data);
        this.upcomingQuestionsList = questionsList[0];

        for (let i = 0; i < this.upcomingQuestionsList.length; i++) {
          const element = this.upcomingQuestionsList[i];
          this.upcomingSets[element.setNo] = this.upcomingQuestionsList.filter(
            (q: any) => q.setNo === element.setNo
          );
        }
        this.upcomingSets = Object.values(this.upcomingSets);
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

  getQuestions() {
    this.questionApiService.getQuestions().subscribe({
      next: (data) => {
        const questionsList = Object.values(data.data);
        this.questions = questionsList[0];
        console.log(this.questions);
        for (let i = 0; i < this.questions.length; i++) {
          const element = this.questions[i];
          this.sets[element.setNo] = this.questions.filter(
            (q: any) => q.setNo === element.setNo
          );

          this.subjects[element.subject] = this.questions.filter(
            (q: any) => q.subject === element.subject
          );
        }
        this.sets = Object.values(this.sets);
        this.subjects = Object.values(this.subjects);

        for (let i = 0; i < this.subjects.length; i++) {
          //get the each subject, loop through each items in each subject and count the number of distinct setNo
          const element = this.subjects[i];
          const setNo = element.map((item: any) => item.setNo);
          const distinctSetNo = [...new Set(setNo)];
          this.subjects[i] = {
            subject: element[0].subject,
            sets: distinctSetNo.length,
            firstInitial: element[0].subject.charAt(0),
          };
        }

        console.log(this.subjects);

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

  onSubjectClick(subject: any) {
    this.router.navigate([`/questions/subject/${subject}`]);
  }
}
