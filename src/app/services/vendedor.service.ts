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

  updateVendedor(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${API_ENDPOINT}/vendedores/${id}`, formData);
  }



  setFormData(vendedor: VendedorDto, foto: any): FormData {
    const formData = new FormData();
    formData.append('nombre', vendedor.nombre!);
    formData.append('dni', vendedor.dni!);
    formData.append('tfno', vendedor.tfno!);
    formData.append('username', vendedor.username!);
    formData.append('email', vendedor.email!);
    formData.append('password', vendedor.password!);
    formData.append('idRol', vendedor.idRol!.toString());
    formData.append('foto', foto!);

    // for (let [key, value] of formData.entries()) {
    //   console.log(key + ": " + value);
    // }
    return formData;
  }
}
