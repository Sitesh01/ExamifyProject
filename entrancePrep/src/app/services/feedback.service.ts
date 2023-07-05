import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment as config } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  baseUrl = `${config.baseUrl}/feedbacks`;
  constructor(private http: HttpClient) {}


   // Feedback API calls
   submitFeedback(feedback: any, userId: any, testId: any) {
    return this.http.post(
      `${this.baseUrl}/${userId}/${testId}`,
      feedback
    );
  }

  getFeedbackByUserDetails() {
    return this.http
      .get(`${this.baseUrl}/getFeedbacksByUserId`)
      .pipe(map((res: any) => res));
  }
}
