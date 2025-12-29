import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Deporte, DeporteCreateRequest, DeporteUpdateRequest } from '../interfaces/deporte.model';
import { Usuario, UsuarioResponse } from '../interfaces/Usuario';
import { DeporteUsuarioRequest } from '../interfaces/deporte-usuario';

@Injectable({ providedIn: 'root' })
export class DeportesService {

  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8000';

  //obtener todos los deportes
  getAll() {
    return this.http.get<Deporte[]>(`${this.API_URL}/deportes`);
  }
   //obtener deporte por su id
  getById(id: number) {
    return this.http.get<Deporte>(`${this.API_URL}/deportes/${id}`);
  }
   //crear deporte
  crearDeporte(data: DeporteCreateRequest) {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    if (data.descripcion) formData.append('descripcion', data.descripcion);
    return this.http.post<Deporte>(`${this.API_URL}/deportes`, formData);
  }

  //busqueda por nombre de deporte
  getByNombre(nombre: string) {
    return this.http.get<Deporte>(`${this.API_URL}/deportes/nombre/${nombre}`);
  }

  //actualizar deporte
  updateDeporte(id: number, data: DeporteUpdateRequest) {
    return this.http.put(`${this.API_URL}/deportes/${id}`, data);
  }

  //Para subir y obtener la imagen
  subirImagen(deporteId: number, imagen: File) {
    const formData = new FormData();
    formData.append('imagen', imagen);

    return this.http.put(
      `${this.API_URL}/deportes/${deporteId}/imagen`,
      formData
    );
  }
obtenerImagen(deporteId: number) {
  // Quitamos responseType: 'text' para que Angular lo parsee como JSON automáticamente
  return this.http.get<any>(
    `${this.API_URL}/deportes/${deporteId}/imagen`
  );
}

  // crear usuario coach | coordinador
  crearUsuario(data: Usuario) {
    return this.http.post(`${this.API_URL}/usuarios`, data);
  }
  // obtiene todos los usuarios
  getUsuarios() {
    return this.http.get<Usuario[]>(`${this.API_URL}/usuarios`);
  }

  //Crea asignacion de un coach a un deporte
  asignarCoach(data: DeporteUsuarioRequest) {
    return this.http.post(`${this.API_URL}/deporte_usuario`, data);
  }


  updateDeporteImagen(id: number, imagen: File) {
    const formData = new FormData();
    formData.append('imagen', imagen);

    return this.http.put(`${this.API_URL}/deportes/${id}/imagen`, formData);
  }

  //eliminar deporte
  delete(id: number) {
    return this.http.delete(`${this.API_URL}/deportes/${id}`);
  }
}
