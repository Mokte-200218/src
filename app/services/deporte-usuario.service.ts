import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeporteUsuario, DeporteUsuarioRequest } from '../interfaces/deporte-usuario';

@Injectable({ providedIn: 'root' })
export class DeporteUsuarioService {
  private http = inject(HttpClient);
  private API = 'http://localhost:8000';

  getByUsuario(id: number) {
    return this.http.get<DeporteUsuario>(`${this.API}/deporte_usuario/${id}`);
  }

  create(data: DeporteUsuarioRequest) {
    return this.http.post(`${this.API}/deporte_usuario`, data);
  }

  update(id: number, data: DeporteUsuarioRequest) {
    return this.http.put(`${this.API}/deporte_usuario/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/deporte_usuario/${id}`);
  }
}
