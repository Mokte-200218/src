import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RendimientoService {
  private http = inject(HttpClient);
  private API = 'http://localhost:8000';

  graficaAtleta(atletaId: number) {
    return this.http.get(
      `${this.API}/analisis/atleta/${atletaId}`,
      { responseType: 'text' }
    );
  }
}
