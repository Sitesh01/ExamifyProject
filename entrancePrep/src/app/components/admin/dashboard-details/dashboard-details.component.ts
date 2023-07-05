import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { QuestionService } from 'src/app/services/question.service';
import { BlogService } from 'src/app/services/blog.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard-details',
  templateUrl: './dashboard-details.component.html',
  styleUrls: ['./dashboard-details.component.scss'],
})
export class DashboardDetailsComponent {
  activeUsers: number = 0;
  totalUsers: number = 0;
  totalBlogs: number = 12;
  totalQuestions: number = 10;

  users: any = [];

  currentUser!: User;
  admin: boolean = false;

  constructor(
    private navigate: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private apiService: ApiService,
    private questionApiService: QuestionService,
    private blogApiService: BlogService
  ) {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
  }

  ngOnInit(): void {
    if (
      this.currentUser['data'].user.role === 'admin' ||
      this.currentUser['data'].user.role === 'moderator'
    ) {
      this.getAllUsers();
      this.getAllQuestions();
      this.getAllBlogs();
      this.admin = true;
    } else {
      this.admin = false;
    }
  }

  getAllUsers() {
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.totalUsers = this.users.results;
        this.apiService.loader.next(false);
      },
      error: (error) => {
        this._snackBar.open('Error from dashboard:  ' + error, 'Close', {
          duration: 2000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
        });
        this.apiService.loader.next(false);
      },
    });
  }

  getAllQuestions() {
    this.questionApiService.getQuestions().subscribe({
      next: (data) => {
        this.users = data;
        this.totalQuestions = this.users.results;
        this.apiService.loader.next(false);
      },
      error: (error) => {
        this._snackBar.open('Error from dashboard:  ' + error, 'Close', {
          duration: 2000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
        });
        this.apiService.loader.next(false);
      },
    });
  }

  getAllBlogs() {
    this.blogApiService.getBlogs().subscribe({
      next: (data) => {
        this.users = data;
        this.totalBlogs = this.users.results;
        this.apiService.loader.next(false);
      },
      error: (error) => {
        this._snackBar.open('Error from dashboard:  ' + error, 'Close', {
          duration: 2000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
        });
        this.apiService.loader.next(false);
      },
    });
  }
}
