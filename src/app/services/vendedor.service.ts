import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINT } from '../../app.env';
import { Vendedor } from '../models/vendedor.model';
import { VendedorDto } from '../models/models-dto/vendedor-dto.model';

@Injectable({
  providedIn: 'root'
})
export class VendedorService {

  constructor(private http: HttpClient) { }

  getVendedores(): Observable<any> {
    return this.http.get(`${API_ENDPOINT}/vendedores`);
  }

  saveVendedor(formData: FormData): Observable<any> {
    return this.http.post(`${API_ENDPOINT}/vendedores`, formData);
  }
}
