import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment as config } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = config.baseUrl;
  constructor(private http: HttpClient) {}
  loader = new BehaviorSubject(false);
}
