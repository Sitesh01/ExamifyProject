import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-edit-blog-dialog',
  templateUrl: './edit-blog-dialog.component.html',
  styleUrls: ['./edit-blog-dialog.component.scss'],
})
export class EditBlogDialogComponent {
  public Editor: any = ClassicEditor;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditBlogDialogComponent>,
    private blogApiService: BlogService
  ) {}

  title: string = '';
  category: string = '';
  content: string = '';
  author: string = '';
  categories: string[] = ['Work', 'Personal', 'Others'];
  blog: any = {};

  header: string = '';
  btnAction: string = '';
  isEdit: boolean = false;

  blogForm: FormGroup = this.formBuilder.group({
    title: ['', Validators.required],
    category: ['', Validators.required],
    content: ['', Validators.required],
    author: ['', Validators.required],
  });

  ngOnInit(): void {
    this.header = this.data.header;
    this.btnAction = this.data.btnAction;
    this.isEdit = this.data.isEdit;
    this.blog = this.data.items;

    console.log(this.blog);

    if (this.isEdit) {
      this.blogForm.controls['title'].setValue(this.blog.title);
      this.blogForm.controls['category'].setValue(this.blog.category);
      this.blogForm.controls['content'].setValue(this.blog.content);
      this.blogForm.controls['author'].setValue(this.blog.author);
    }
  }

  editBlog() {
    const { title, category, content, author } = this.blogForm.getRawValue();
    if (this.isEdit) {
      this.blogApiService
        .editBlog({ title, category, content, author }, this.blog._id)
        .subscribe((res) => {
          this.dialogRef.close({ value: 'edited' });
        });
    } else {
      console.log(this.blogForm.value.content);
      this.blogApiService
        .createBlog({ title, category, content, author })
        .subscribe((res) => {
          this.dialogRef.close({ value: 'added' });
        });
    }
  }
}
