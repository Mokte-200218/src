import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Atleta, AtletaCreateRequest} from '../interfaces/atleta.model'

@Injectable({ providedIn: 'root' })
export class AtletasService {
  private http = inject(HttpClient);
  private API = 'http://localhost:8000';

  getByDeporte(deporteId: number) {
    return this.http.get<Atleta[]>(`${this.API}/atletas/deporte/${deporteId}`);
  }

  getAll() {
    return this.http.get<Atleta[]>(`${this.API}/atletas`);
  }

  getById(id: number) {
    return this.http.get<Atleta>(`${this.API}/atletas/${id}`);
  }

  create(data: AtletaCreateRequest) {
    return this.http.post(`${this.API}/atletas`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/atletas/${id}`);
  }
}
