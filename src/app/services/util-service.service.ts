import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilServiceService {

  constructor() { }

  // Convertir imágenes seleccionadas a Base64
  convertirImagenesABase64(files: File[]): Observable<{ nombre: string; dataType: string; base64: string }[]> {
    return new Observable((observer) => {
      const resultadosBase64: { nombre: string; dataType: string; base64: string }[] = [];

      const convertirArchivo = (file: File): Promise<{ nombre: string; dataType: string; base64: string }> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const [dataType, base64] = result.split(','); // Dividir el prefijo y el contenido Base64
            resolve({
              nombre: file.name,
              dataType, // Prefijo como 'data:image/...'
              base64, // Código Base64 sin el prefijo
            });
          };
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file); // Convertir archivo a Base64
        });
      };

      const procesarArchivos = async () => {
        for (const archivo of files) {
          try {
            const resultado = await convertirArchivo(archivo);
            resultadosBase64.push(resultado);
          } catch (error) {
            observer.error(error);
          }
        }
        observer.next(resultadosBase64);
        observer.complete();
      };

      procesarArchivos();
    });
  }

}
