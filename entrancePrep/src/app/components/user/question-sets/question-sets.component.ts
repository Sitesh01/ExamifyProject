import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { MatDialog } from '@angular/material/dialog';
import { VerifyDialogComponent } from '../../common/utilities/verify-dialog/verify-dialog.component';
import { QuestionService } from 'src/app/services/question.service';
import { AnswerService } from 'src/app/services/answer.service';

@Component({
  selector: 'app-question-sets',
  templateUrl: './question-sets.component.html',
  styleUrls: ['./question-sets.component.scss'],
})
export class QuestionSetsComponent {
  questions: any = [];
  sets: any = {};
  subjects: any = {};
  totalSets: any;

  currentSubjectSets: any = [];

  currentUser!: User;
  admin: boolean = false;

  submittedAnswers: any = [];
  subjectGiven: any = [];
  showSets: any = [];

  subjectFromParam: any;
  hasSubjectGiven: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private dialog: MatDialog,
    private questionApiService: QuestionService,
    private answerApiService: AnswerService
  ) {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
  }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe((params) => {
      this.subjectFromParam = params['subject'];
    });

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

  getQuestions() {
    this.questionApiService
      .getQuestionsBySubject(this.subjectFromParam)
      .subscribe({
        next: (data) => {
          this.questions = data.data.questions;
          // loop through each question and seperate them by set
          this.questions.forEach((question: any) => {
            if (this.sets[question.setNo]) {
              this.sets[question.setNo].push(question);
            } else {
              this.sets[question.setNo] = [question];
            }
          });

          this.sets = Object.values(this.sets);
          console.log("_________", this.sets);
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
    await this.getCurrentUserSubmissionRecord();
    if (this.subjectGiven.length === this.sets.length) {
      this.showSets = this.sets.filter((set: any) => {
        return this.subjectGiven.includes(set[0].subject, set[0].setNo);
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
            this.submittedAnswers.forEach((answer: any) => {
              const subject = answer.subject;
              const setNo = answer.setNo;
              this.sets.forEach((set: any) => {
                if (set[0].subject === subject && set[0].setNo === setNo) {
                  // if the subject and setNo matches, push the subject into the subjectGiven array
                  this.subjectGiven.push(subject, setNo);
                }
              });
            });

            console.log(this.subjectGiven);
            this.apiService.loader.next(false);
          },
          error: (error) => {
            reject(error);
            this._snackBar.open(error.error.message, 'Close', {
              duration: 2000,
              panelClass: ['error-snackbar'],
              verticalPosition: 'top',
            });
          },
          complete: () => {
            this.hasSubjectGiven = true; // set flag to true once subjectGiven has been populated
            resolve(this.subjectGiven);
          },
        });
    });
  }

  // navigate to test instruction page
  onSetClick(set: any, subject: any) {
    this.router.navigate([`/test-instruction/${subject}/${set}`]);
  }

  // navigate to submitted answers page
  viewCurrentSetRecord(subject: any, setNo: any) {
    this.router.navigate([`/submittedAnswers/${subject}/${setNo}`]);
  }

  // reset current set record to start test again
  async resetCurrentSetRecord(subject: any, setNo: any) {
    this.dialog
      .open(VerifyDialogComponent, {
        data: {
          title: 'reset',
          message: 'You will lose your previous record.',
          btnAction: 'Yes',
          taskToDO: 'resetPreviousRecord',
          data: {
            subject: subject,
            setNo: setNo,
            userId: this.currentUser['data'].user.uniqueID,
          },
        },
      })
      .afterClosed()
      .subscribe(async (result) => {
        if (result.value === 'resettedRecord') {
          await this.getCurrentUserSubmissionRecord();
          this._snackBar.open('Record reset successfully', 'Close', {
            duration: 2000,
            panelClass: ['success-snackbar'],
            verticalPosition: 'top',
          });
          this.subjectGiven = [];
        }
      });
  }

  checkIfUserHasSubmitted(subject: any, setNo: any) {
    let submitted = false;
    this.submittedAnswers.forEach((answer: any) => {
      if (answer.subject === subject && answer.setNo === setNo) {
        submitted = true;
      }
    });
    return submitted;
  }
}
