import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AnswerService } from 'src/app/services/answer.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-examines',
  templateUrl: './examines.component.html',
  styleUrls: ['./examines.component.scss'],
})
export class ExaminesComponent {
  examines: any = [];
  displayedColumns = ['username', 'email', 'subject', 'testId', 'createdAt', 'score', 'duration'];
  public searchText = '';
  users: any = [];

  constructor(
    private apiService: ApiService,
    private _snackBar: MatSnackBar,
    private answerApiService: AnswerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getRecentExamines();
  }

  getRecentExamines() {
    this.answerApiService.getAllRecentSubmission().subscribe({
      next: (data) => {
        console.log("data from backend: ", data); 
        this.examines = data.data.answerWithUsers;
        this.examines.forEach((element: any) => {
          this.users.push(element.user);
        });

        console.log( "total examines: ",this.examines);
        console.log( "total users: ",this.users);
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

  public get filteredExamines() {
    if (!this.searchText) {
      return this.users;
    }
    return this.users.filter((user: any) => {
      const search = this.searchText.toLowerCase();
      console.log("search: ", search);
      console.log("user: ", user);

      return (
        user.username.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    });
  }

  filterData() {
    const searchText = this.searchText.toLowerCase();
    this.users = this.examines.filter((user: any) => {
      const username = user.username.toLowerCase();
      const email = user.email.toLowerCase();
      const searchTerms = [username, email];
      return searchTerms.some((term) => term.includes(searchText));
    });
  }

  getExamineDetails(testId: any) {
    this.router.navigate([`/examineDetails/${testId}`]);
  }
}
