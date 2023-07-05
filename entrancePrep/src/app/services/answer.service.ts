import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment as config } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnswerService {
  baseUrl = `${config.baseUrl}/answers`;
  constructor(private http: HttpClient) {}

  // Answers API calls
  submitAnswer(answer: any, userId: any) {
    console.log('answerForm in apiService', answer);
    return this.http.post(`${this.baseUrl}/${userId}`, answer);
  }

  getSetRecordsByUserId(userId: any) {
    return this.http
      .get(`${this.baseUrl}/${userId}`)
      .pipe(map((res: any) => res));
  }

  deleteSetRecordsByUserIdAndSubject(userId: any, subject: any, setNo: any) {
    return this.http.delete(
      `${this.baseUrl}/deleteAnswer/${userId}/${subject}/${setNo}`
    );
  }

  // answers - api call for viewing results
  getAnswersBySubject(userId: any, subject: any, setNo: any) {
    return this.http
      .get(`${this.baseUrl}/getAnswerBySubject/${userId}/${subject}/${setNo}`)
      .pipe(map((res: any) => res));
  }

  getAllRecentSubmission() {
    return this.http
      .get(`${this.baseUrl}/examines/list`)
      .pipe(map((res: any) => res));
  }

  //for user-dashboard
  getUserProgress(userId: any) {
    return this.http
      .get(`${this.baseUrl}/getProgress/${userId}`)
      .pipe(map((res: any) => res));
  }

  getExaminesDetails(testId: any) {
    return this.http
      .get(`${this.baseUrl}/examinesDetails/${testId}`)
      .pipe(map((res: any) => res));
  }

  //check if the user has already submitted the test
  checkIfUserHasSubmitted(userId: any, subject: any, setNo: any) {
    return this.http
      .get(`${this.baseUrl}/getAnswerIfTestGiven/${userId}/${subject}/${setNo}`)
      .pipe(map((res: any) => res));
  }
}
