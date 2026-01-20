import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocumentoAtleta } from '../interfaces/documento-atleta.model';

@Injectable({ providedIn: 'root' })
export class DocumentosService {
  private http = inject(HttpClient);
  private API = 'http://localhost:8000';

  getByAtleta(atletaId: number) {
    return this.http.get<DocumentoAtleta[]>(`${this.API}/documentos/atleta/${atletaId}`);
  }

  upload(atletaId: number, file: File) {
    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('atleta_id', atletaId.toString());

    return this.http.post(`${this.API}/documentos`, formData);
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/documentos/${id}`);
  }
}
