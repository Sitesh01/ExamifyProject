import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment as config } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  baseUrl = `${config.baseUrl}/blogs`;
  constructor(private http: HttpClient) {}

  //Blogs API calls
  getBlogs() {
    return this.http.get(`${this.baseUrl}`).pipe(map((res: any) => res));
  }

  getBlogById(blogId: any) {
    return this.http.get(`${this.baseUrl}/${blogId}`).pipe(map((res: any) => res));
  }

  createBlog(blog: any) {
    return this.http.post(`${this.baseUrl}`, blog);
  }

  editBlog(blog: any, id: any) {
    return this.http.patch(`${this.baseUrl}/${id}`, blog);
  }

  deleteBlog(id: any) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
