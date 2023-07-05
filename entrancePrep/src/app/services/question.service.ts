import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment as config } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  baseUrl = `${config.baseUrl}/questions`;
  constructor(private http: HttpClient) {}

  // Questions API calls
  getQuestions() {
    return this.http.get(`${this.baseUrl}`).pipe(map((res: any) => res));
  }

  getQuestionBySetNo(setNo: any, subject: any) {
    return this.http
      .get(`${this.baseUrl}/questionsInSet/${subject}/${setNo}`)
      .pipe(map((res: any) => res));
  }

  addQuestion(question: any) {
    return this.http.post(`${this.baseUrl}`, question);
  }

  getQuestionById(id: any) {
    return this.http
      .get(`${this.baseUrl}/getQuestionById/${id}`)
      .pipe(map((res: any) => res));
  }

  updateQuestion(question: any, id: any) {
    return this.http.patch(`${this.baseUrl}/${id}`, question);
  }

  deleteQuestion(id: any) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getUpcomingQuestions() {
    return this.http
      .get(`${this.baseUrl}/upcomingQuestions`)
      .pipe(map((res: any) => res));
  }

  getQuestionsBySubject(subject: any) {
    return this.http
      .get(`${this.baseUrl}/getQuestionBySubject/${subject}`)
      .pipe(map((res: any) => res));
  }
}
