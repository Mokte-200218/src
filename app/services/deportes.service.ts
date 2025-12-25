import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Deporte, DeporteCreateRequest, DeporteUpdateRequest } from '../interfaces/deporte.model';

@Injectable({ providedIn: 'root' })
export class DeportesService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8000';

  getAll() {
    return this.http.get<Deporte[]>(`${this.API_URL}/deportes`);
  }

  getByNombre(nombre: string) {
    return this.http.get<Deporte>(`${this.API_URL}/deportes/nombre/${nombre}`);
  }

  getById(id: number) {
    return this.http.get<Deporte>(`${this.API_URL}/deportes/${id}`);
  }

  create(data: DeporteCreateRequest) {
    const form = new FormData();
    form.append('nombre', data.nombre);
    if (data.descripcion) form.append('descripcion', data.descripcion);
    if (data.imagen) form.append('imagen', data.imagen);

    return this.http.post(`${this.API_URL}/deportes`, form);
  }

  update(id: number, data: DeporteUpdateRequest) {
    const form = new FormData();
    form.append('nombre', data.nombre);
    if (data.descripcion) form.append('descripcion', data.descripcion);
    if (data.imagen) form.append('imagen', data.imagen);

    return this.http.put(`${this.API_URL}/deportes/${id}`, form);
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/deportes/${id}`);
  }
}
