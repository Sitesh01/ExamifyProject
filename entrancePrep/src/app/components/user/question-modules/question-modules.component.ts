import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { MatDialog } from '@angular/material/dialog';
import { VerifyDialogComponent } from '../../common/utilities/verify-dialog/verify-dialog.component';
import { QuestionService } from 'src/app/services/question.service';
import { AnswerService } from 'src/app/services/answer.service';

@Component({
  selector: 'app-question-modules',
  templateUrl: './question-modules.component.html',
  styleUrls: ['./question-modules.component.scss'],
})
export class QuestionModulesComponent {
  questions: any = [];
  sets: any = {};
  subjects: any = {};
  totalSets: any;

  currentUser!: User;
  admin: boolean = false;

  submittedAnswers: any = [];
  subjectGiven: any = [];
  showSets: any = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private dialog: MatDialog,
    private questionApiService: QuestionService,
    private answerApiService: AnswerService
  ) {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
  }

  async ngOnInit(): Promise<void> {
    this.getQuestions();
    this.authService.currentUser.subscribe((x) => {
      this.currentUser = x;
      if (
        this.currentUser['data'].user.role === 'admin' ||
        this.currentUser['data'].user.role === 'moderator'
      ) {
        this.admin = true;
      }
      this.getCurrentUserSubmissionRecord().then(() => {
        this.checkSets();
      });
    });
  }

  addQuestion() {
    this.router.navigate(['/question']);
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

  async checkSets() {
    const subjectGiven = await this.getCurrentUserSubmissionRecord();
    if (this.subjectGiven.length === this.sets.length) {
      this.showSets = this.sets.filter((set: any) => {
        return this.subjectGiven.includes(set[0].subject);
      });
    }
  }

  async getCurrentUserSubmissionRecord() {
    return new Promise((resolve, reject) => {
      this.answerApiService
        .getSetRecordsByUserId(this.currentUser['data'].user.uniqueID)
        .subscribe({
          next: (data) => {
            this.submittedAnswers = data.data.answers;
            for (let i = 0; i < this.sets.length; i++) {
              const element = this.sets[i];
              const subject = element[0].subject;
              const hasSubmitted = this.submittedAnswers.some(
                (answer: any) => answer.subject === subject
              );
              if (hasSubmitted) {
                this.subjectGiven.push(subject);
              }
            }
            this.apiService.loader.next(false);
            resolve(this.subjectGiven);
          },
          error: (error) => {
            reject(error);
            this._snackBar.open(error.error.message, 'Close', {
              duration: 2000,
              panelClass: ['error-snackbar'],
              verticalPosition: 'top',
            });
          },
        });
    });
  }

  onSubjectClick(subject: any) {
    this.router.navigate([`/questions/subject/${subject}`]);
  }

  onSetClick(set: any, subject: any) {
    this.router.navigate([`/test-instruction/set/${set}/${subject}`]);
  }

  viewCurrentSetRecord(subject: any) {
    this.router.navigate([`/questions/subject/${subject}`]);
  }

  resetCurrentSetRecord(subject: any) {
    this.dialog
      .open(VerifyDialogComponent, {
        data: {
          title: 'reset',
          message: 'You will lose your previous record.',
          btnAction: 'Yes',
          taskToDO: 'resetPreviousRecord',
          data: {
            subject: subject,
            userId: this.currentUser['data'].user.uniqueID,
          },
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result.value === 'resettedRecord') {
          this.getCurrentUserSubmissionRecord();
          this._snackBar.open('Record reset successfully', 'Close', {
            duration: 2000,
            panelClass: ['success-snackbar'],
            verticalPosition: 'top',
          });
          this.subjectGiven = [];
        }
      });
  }
}
