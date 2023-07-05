import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { VerifyDialogComponent } from '../../common/utilities/verify-dialog/verify-dialog.component';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-admin-questions-list',
  templateUrl: './admin-questions-list.component.html',
  styleUrls: ['./admin-questions-list.component.scss'],
})
export class AdminQuestionsListComponent {
  questions: any = [];
  setNo: any = '';
  subjectFromParams: any = '';

  currentUser!: User;
  userId: any = '';
  admin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private questionApiService: QuestionService
  ) {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    this.userId = this.currentUser['data'].user.uniqueID;
  }

  async ngOnInit(): Promise<void> {
    this.setNo = this.route.snapshot.paramMap.get('id');
    this.subjectFromParams = this.route.snapshot.paramMap.get('subject');
    this.getQuestionBySetNo();
    this.authService.currentUser.subscribe((x) => {
      this.currentUser = x;
      if (
        this.currentUser['data'].user.role === 'admin' ||
        this.currentUser['data'].user.role === 'moderator'
      ) {
        this.admin = true;
      }
    });
  }

  getQuestionBySetNo() {
    this.questionApiService
      .getQuestionsBySubject(this.subjectFromParams)
      .subscribe({
        next: (data) => {
          this.questions = data.data.questions;
          console.log('Question list for editing: ', this.questions);
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
    this.router.navigate(['/question-lists']);
  }

  addQuestion() {
    this.router.navigate([`/question/${this.setNo}/${this.subjectFromParams}`]);
  }

  editQuestion(question: any, status: any) {
    this.router.navigate([
      `/question/${this.setNo}/${this.subjectFromParams}/${status}/${question._id}`,
    ]);
  }

  deleteQuestion($event: Event, ques_id: any) {
    $event.stopPropagation();
    const title = 'delete this question';
    const message = 'This is a soft delete. You can restore it later.';
    const taskToDO = 'deleteQuestion';
    const btnAction = 'Delete';
    this.dialog
      .open(VerifyDialogComponent, {
        width: '481px',
        data: { title, message, taskToDO, btnAction, ques_id },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res.value === 'question deleted') {
          this.getQuestionBySetNo();
          this._snackBar.open('✔ Deleted successfully', 'X', {
            duration: 2000,
            panelClass: ['success-snackbar'],
            verticalPosition: 'top',
          });
        }
      });
  }
}
