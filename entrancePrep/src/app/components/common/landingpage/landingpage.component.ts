import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss'],
})
export class LandingpageComponent {
  blogs: any = [];

  constructor(
    private apiService: ApiService,
    private blogApiService: BlogService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getBlogs();
  }

  getBlogs() {
    this.blogApiService.getBlogs().subscribe({
      next: (data) => {
        this.blogs = data.data.blogs;
        // from blogs, fetch the first 3 blogs and store it in blogs
        this.blogs = this.blogs.slice(0, 3);
        console.log(this.blogs);
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

  onSetClick(blog_Id: any) {
    console.log(blog_Id);
    this.router.navigate([`/blogs/${blog_Id}`]);
  }
}
