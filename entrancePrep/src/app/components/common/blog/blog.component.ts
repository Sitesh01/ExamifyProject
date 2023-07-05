import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { EditBlogDialogComponent } from '../../admin/add-edit-blog-dialog/edit-blog-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VerifyDialogComponent } from '../../common/utilities/verify-dialog/verify-dialog.component';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent {
  blogs: any = [];
  blogsImages: any = '';
  tags = ['work', 'life', 'love', 'happy'];
  slicedBlogs: any = [];

  currentUser!: User;
  admin: boolean = false;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private blogApiService: BlogService,
    private router: Router
  ) {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
  }

  ngOnInit(): void {
    this.getBlogList();
    if (
      this.currentUser['data'].user.role === 'admin' ||
      this.currentUser['data'].user.role === 'moderator'
    ) {
      this.admin = true;
    }
  }

  addBlog() {
    // this.router.navigate(['/blog']);
    const header = 'Add';
    const btnAction = 'Create';
    const isEdit = false;

    this.dialog
      .open(EditBlogDialogComponent, {
        panelClass: 'edit-blog-dialog',
        data: { header, btnAction, isEdit },
        height: 'fit-content',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result.value === 'added') {
          this._snackBar.open('✔ Added successfully', 'X', {
            duration: 2000,
            panelClass: ['success-snackbar'],
            verticalPosition: 'top',
          });
          this.getBlogList();
        }
      });
  }

  getBlogList() {
    this.blogApiService.getBlogs().subscribe({
      next: (data) => {
        const blogsList = Object.values(data.data);
        this.blogs = blogsList[0];
        this.slicedBlogs = this.blogs.slice(1);
        this.apiService.loader.next(false);
      },
      error: (error) => {
        this._snackBar.open(`${error.error.message}`, 'X', {
          duration: 2000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
        });
      },
    });
  }

  onSetClick(blog_Id: any) {
    this.router.navigate([`/blogs/${blog_Id}`]);
  }

  editBlog($event: Event, items: any) {
    $event.stopPropagation();
    const header = 'Edit';
    const btnAction = 'Update';
    const isEdit = true;
    this.dialog
      .open(EditBlogDialogComponent, {
        panelClass: 'edit-blog-dialog',
        data: { header, btnAction, isEdit, items },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res.value === 'edited') {
          this._snackBar.open('✔ Updated successfully', 'X', {
            duration: 2000,
            panelClass: ['success-snackbar'],
            verticalPosition: 'top',
          });
          this.getBlogList();
        }
      });
  }

  deleteBlog($event: Event, id: any) {
    $event.stopPropagation();
    const title = 'delete this blog';
    const message = 'This action cannot be undone.';
    const taskToDO = 'deleteBlog';
    const btnAction = 'Delete';
    this.dialog
      .open(VerifyDialogComponent, {
        width: '481px',
        data: { title, message, taskToDO, btnAction, id },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res.value === 'deleted') {
          this.getBlogList();
          this._snackBar.open('✔ Deleted successfully', 'X', {
            duration: 2000,
            panelClass: ['success-snackbar'],
            verticalPosition: 'top',
          });
        }
      });
  }
}
