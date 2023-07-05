import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment as config } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  baseUrl = `${config.baseUrl}/comments`;
  constructor(private http: HttpClient) {}

  // Comments API calls
  submitComment(comment: any, userId: any, blogId: any) {
    return this.http.post(`${this.baseUrl}/${userId}/${blogId}`, comment);
  }

  getAllComments() {
    return this.http.get(`${this.baseUrl}`).pipe(map((res: any) => res));
  }

  getCommentsByBlogId(blogId: any) {
    return this.http
      .get(`${this.baseUrl}/${blogId}`)
      .pipe(map((res: any) => res));
  }

  markCommentAsVerified(commentId: any) {
    return this.http.patch(
      `${this.baseUrl}/markCommentAsVerified/${commentId}`,
      {}
    );
  }

  getReviewedComments() {
    return this.http
      .get(`${this.baseUrl}/reviewed/list`)
      .pipe(map((res: any) => res));
  }
}
