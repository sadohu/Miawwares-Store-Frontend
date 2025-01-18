import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  logIn(auth: Auth): Observable<any> {
    const params = { username: auth.username, password: auth.password };
    return this.http.post('http://localhost:3000/api/auth/login', params);
  }

  logOut(auth: Auth): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${auth.accessToken}`
    });
    // { refreshToken: user.accessToken };
    return this.http.post('http://localhost:3000/api/auth/logout', null, { headers });
  }

  saveAuthOnSessionStorage(auth: Auth) {
    sessionStorage.setItem('auth', JSON.stringify(auth));
  }

  saveUserOnSessionStorage(user: User) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  getAuthOnSessionStorage(): Auth | null {
    const auth = sessionStorage.getItem('auth');
    return auth ? JSON.parse(auth) : null;
  }

  getUserOnSessionStorage(): User | null {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  deleteAuthOnSessionStorage() {
    sessionStorage.removeItem('auth');
  }

  deleteUserOnSessionStorage() {
    sessionStorage.removeItem('user');
  }

  clearSessionStorage() {
    sessionStorage.clear();
  }

}
