import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  logIn(user: User): Observable<any> {
    const params = { username: user.username, password: user.password };
    return this.http.post('http://localhost:3000/api/auth/login', params);
  }
}
