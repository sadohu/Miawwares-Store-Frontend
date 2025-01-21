import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINT } from '../../app.env';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(private http: HttpClient) { }

  getRoles(): Observable<any> {
    return this.http.get(`${API_ENDPOINT}/roles`);
  }
}
