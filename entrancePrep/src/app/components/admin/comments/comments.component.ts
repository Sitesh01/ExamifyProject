import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent {
  comments: any = [];
  reviewedComments: any = [];


  constructor(
    private apiService: ApiService,
    private _snackBar: MatSnackBar,
    private commentApiService: CommentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getComments();
    this.getReviewedComments();
  }

  getComments() {
    this.commentApiService.getAllComments().subscribe({
      next: (data) => {
        this.comments = data.data.commentsWithUsers;
        console.log('all comments: ', this.comments);
        this.apiService.loader.next(false);
      },
      error: (error) => {
        console.log(error);
        this._snackBar.open(`🚨 ${error.error.message}`, '❌', {
          duration: 3000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
        });
        this.apiService.loader.next(false);
      },
    });
  }

  markCommentAsVerified(commentId: any) {
    this.commentApiService.markCommentAsVerified(commentId).subscribe({
      next: (data) => {
        this._snackBar.open('✔ Comment verified', 'X', {
          duration: 3000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
        });
        this.apiService.loader.next(false);
        this.getComments();
      },
      error: (error) => {
        this._snackBar.open(`🚨 ${error.error.message}`, '❌', {
          duration: 3000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
        });
        this.apiService.loader.next(false);
      },
    });
  }

  getReviewedComments() {
    this.commentApiService.getReviewedComments().subscribe({
      next: (data) => {
        this.reviewedComments = data.data.commentsWithUsers;
        console.log('reviewed comments: ', this.reviewedComments);
        this.apiService.loader.next(false);
      },
      error: (error) => {
        console.log(error);
        this._snackBar.open(`🚨 ${error.error.message}`, '❌', {
          duration: 3000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
        });
        this.apiService.loader.next(false);
      },
    });
  }

  onCommentClick(blogId: any) {
    this.router.navigate([`/blogs/${blogId}`]);
  }
}
