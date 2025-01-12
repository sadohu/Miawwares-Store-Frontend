import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  logIn(email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:3000/api/auth/login',
      { username: email, password: password });


  }
}
