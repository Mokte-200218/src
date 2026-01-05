import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Deporte, DeporteCreateRequest, DeporteUpdateRequest } from '../interfaces/deporte.model';
import { Usuario, UsuarioResponse, usuarioid } from '../interfaces/Usuario';
import { DeporteUsuarioRequest } from '../interfaces/deporte-usuario';
import { Observable } from 'rxjs';


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
  createSport(data: DeporteCreateRequest) {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    if (data.descripcion) formData.append('descripcion', data.descripcion);
    return this.http.post<Deporte>(`${this.API_URL}/deportes`, formData);
  }

  //busqueda por nombre de deporte
  getByName(nombre: string) {
    return this.http.get<Deporte>(`${this.API_URL}/deportes/nombre/${nombre}`);
  }

  //actualizar deporte
  updateSport(id: number, data: DeporteUpdateRequest) {
    return this.http.put(`${this.API_URL}/deportes/${id}`, data);
  }

  //Para subir la imagen del deporte
  postImage(sportId: number, imagen: File) {
    const formData = new FormData();
    formData.append('imagen', imagen);
    return this.http.put(
      `${this.API_URL}/deportes/${sportId}/imagen`,
      formData
    );
  }
  //obtiene imagen de un deporte mediante id del deporte
  getImage(sportId: number) {
    return this.http.get<any>(
      `${this.API_URL}/deportes/${sportId}/imagen`
    );
  }

  // crear usuario coach | coordinador
  createUser(data: Usuario) {
    return this.http.post(`${this.API_URL}/usuarios`, data);
  }
  // obtiene todos los usuarios
  getUsers() {
    return this.http.get<Usuario[]>(`${this.API_URL}/usuarios`);
  }
  getUsersObservable(): Observable<usuarioid[]> {
   return this.http.get<usuarioid[]>(`${this.API_URL}/usuarios`);
  }

  //Crea asignacion de un coach a un deporte
  assignCoach(data: DeporteUsuarioRequest) {
    return this.http.post(`${this.API_URL}/deporte_usuario`, data);
  }


  //actualizar imagen de deporte mediante id 
  updateDeporteImagen(id: number, imagen: File) {
    const formData = new FormData();
    formData.append('imagen', imagen);

    return this.http.put(`${this.API_URL}/deportes/${id}/imagen`, formData);
  }

  //eliminar deporte
  delete(id: number) {
    return this.http.delete(`${this.API_URL}/deportes/${id}`);
  }

 

  getUserById(id: number): Observable<usuarioid> {
    return this.http.get<usuarioid>(`${this.API_URL}/usuarios/${id}`);
  }

  updateUser(id: number, data: Usuario): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(`${this.API_URL}/usuarios/${id}`, data);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/usuarios/${id}`);
  }
}
