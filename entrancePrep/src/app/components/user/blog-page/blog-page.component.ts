import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BlogService } from 'src/app/services/blog.service';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.scss'],
})
export class BlogPageComponent {
  title: string = '';
  content: string = '';
  image: any = '';
  tags: string[] = [];
  author: string = '';
  blog_Id: any = '';
  blogId: any = '';
  blogData: any = {};

  userId = '';

  currentUser!: User;
  comments: any = [];
  firstInitial: string = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private blogApiService: BlogService,
    private commentApiService: CommentService
  ) {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
  }

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe((params) => {
      this.blog_Id = params.get('id');
    });

    await this.getBlogById();
    this.userId = this.currentUser['data'].user.uniqueID;

    this.getCommentsForThisBlog();
  }

  commentForm = this.formBuilder.group({
    comment: ['', Validators.required],
  });

  async getBlogById() {
    try {
      const data = this.blogApiService.getBlogById(this.blog_Id).toPromise();
      this.blogData = (await data).data.blog;
      this.title = this.blogData.title;
      this.blogId = this.blogData.blogId;
      this.content = this.blogData.content;
      this.image = this.blogData.imageLink;
      this.author = this.blogData.author;
      this.apiService.loader.next(false);
    } catch (error) {
      this._snackBar.open('Error while loading comments!', 'Close', {
        duration: 2000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
      });
      this.apiService.loader.next(false);
    }
  }

  getCommentsForThisBlog() {
    console.log('blogId in getCommentsForThisBlog: ', this.blogId);
    this.commentApiService.getCommentsByBlogId(this.blogId).subscribe({
      next: (data) => {
        this.comments = data.data.commentsWithUsers;
        //for each comment, get the first letter of the user.username and store it in firstInitial property
        this.comments.forEach((comment: any) => {
          comment.firstInitial = comment.user.username[0];
        });

        console.log(this.comments);
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

  submitComment() {
    if (
      this.userId === '' ||
      this.userId === undefined ||
      this.userId === null
    ) {
      this._snackBar.open('Please login to comment', 'Close', {
        duration: 2000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
      });
      this.apiService.loader.next(false);
    } else {
      this.commentApiService
        .submitComment(this.commentForm.value, this.userId, this.blogId)
        .subscribe({
          next: (data) => {
            this._snackBar.open(
              `Comment Submitted Successfully for review`,
              'Close',
              {
                duration: 2000,
                panelClass: ['success-snackbar'],
                verticalPosition: 'top',
              }
            );
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
}
