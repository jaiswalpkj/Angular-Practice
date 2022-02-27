import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  tokenValue = { token: '' };
  private authStatusListener = new Subject<boolean>();
  private userdetailsListener = new Subject<string>();
  private isUserAuthenticated: boolean = false;

  isRefreshed: boolean = false;
  tokenTimer: any;
  private userId: string;
  getToken(): string {
    return this.tokenValue.token;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getIsUserAuthenticated() {
    return this.isUserAuthenticated;
  }
  getUserDetailsListener() {
    return this.userdetailsListener.asObservable();
  }
  getUserId() {
    return this.userId;
  }

  constructor(private http: HttpClient, private router: Router) {}
  createUser(username: string, password: string) {
    const authData: AuthData = { username: username, password: password };
    this.http.post(BACKEND_URL + '/signup', authData).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }
  login(username: string, password: string) {
    let authToken;
    const authData: AuthData = { username: username, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + '/login',
        authData
      )
      .subscribe(
        (response) => {
          authToken = response.token;
          this.tokenValue.token = response.token;
          if (authToken) {
            const expiresIn = response.expiresIn;
            this.setAuthTimer(expiresIn);
            this.isUserAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresIn * 1000);
            this.saveAuthData(
              this.tokenValue.token,
              expirationDate,
              this.userId
            );
            this.router.navigate(['/']);
            this.userdetailsListener.next(localStorage.getItem('userId'));
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }
  logout() {
    this.tokenValue.token = null;
    this.isUserAuthenticated = false;
    this.authStatusListener.next(false);
    this.userdetailsListener.next(null);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.tokenValue.token = authInformation.token;
      this.isUserAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.userdetailsListener.next(authInformation.userId);
    }
  }
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
      alert('Session expired please login again!');
      this.router.navigate(['/login']);
    }, duration * 1000);
  }
  getAuthData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    this.userdetailsListener.next(localStorage.getItem('userId'));
    const expirationDate = localStorage.getItem('expirationDate');
    if (!token && !expirationDate) {
      return;
    } else {
      return {
        token: token,
        expirationDate: new Date(expirationDate),
        userId: userId,
      };
    }
  }
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationDate');
  }
  getUserById(id: string) {
    return this.http.get<{ _id: string; username: string; password: string }>(
      BACKEND_URL + id
    );
  }
}
