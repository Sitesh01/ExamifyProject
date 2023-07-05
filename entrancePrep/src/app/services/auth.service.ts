import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment as config } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = config.baseUrl;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public isAuthenticated$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private readonly AUTH_TOKEN_KEY: string = 'authToken';

  loggedIn = false;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser')!)
    );

    this.currentUser = this.currentUserSubject.asObservable();

    // Check for authentication token in sessionStorage
    const authToken = sessionStorage.getItem(this.AUTH_TOKEN_KEY);
    if (authToken) {
      this.isAuthenticated$.next(true);
    }
  }

  get isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  signup(data: any) {
    return this.http.post(`${this.baseUrl}/users/signup`, data);
  }

  login(data: any) {
    return this.http.post<any>(`${this.baseUrl}/users/login`, data).pipe(
      map((user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  isLoggedIn(authToken: any) {
    sessionStorage.setItem(this.AUTH_TOKEN_KEY, authToken);
    this.isAuthenticated$.next(true);
  }

  getAllUsers() {
    return this.http.get(`${this.baseUrl}/users`);
  }

  logout() {
    sessionStorage.removeItem(this.AUTH_TOKEN_KEY);
    this.isAuthenticated$.next(false);
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(
      JSON.parse(localStorage.getItem('currentUser')!)
    );
    return this.http.get(`${this.baseUrl}/users/logout`);
  }

  createUser(data: any) {
    return this.http.post(`${this.baseUrl}/users/createUser`, data);
  }

  updateUser(id: any, data: any) {
    return this.http.patch(`${this.baseUrl}/users/${id}`, data);
  }

  deleteUser(id: any) {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }

  getCurrentUser(id: any) {
    return this.http.get<any>(`${this.baseUrl}/users/me/${id}`);
  }

  updateMe(data: any) {
    console.log('From authService: updateMe: ', data);
    return this.http.patch(`${this.baseUrl}/users/updateMe`, data);
  }

  changeEmail(data: any) {
    console.log('From authService: changeEmail: ', data);
    return this.http.post(`${this.baseUrl}/users/changeEmail`, data);
  }

  changePassword(data: any) {
    console.log('From authService: changePassword: ', data);
    return this.http.patch(`${this.baseUrl}/users/updateMyPassword`, data);
  }

  forgotPassword(data: any) {
    console.log('From authService: forgotPassword: ', data);
    return this.http.post(`${this.baseUrl}/users/forgotPassword`, data);
  }

  resetPassword(token:any, data: any) {
    console.log('From authService: resetPassword: ', data);
    return this.http.patch(`${this.baseUrl}/users/resetPassword/${token}`, {
      password: data.newPassword,
      passwordConfirm: data.confirmPassword,
    });
  }
}
