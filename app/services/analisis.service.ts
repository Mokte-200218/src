import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AnalisisService {
  private http = inject(HttpClient);
  private API = 'http://localhost:8000';

  analisisDeporte(deporteId: number) {
    return this.http.get(`${this.API}/analisis/deporte/${deporteId}`, {
      responseType: 'text',
    });
  }

  rankingDeporte(deporteId: number, limit = 10) {
    return this.http.get(
      `${this.API}/analisis/ranking/deporte/${deporteId}?limit=${limit}`,
      { responseType: 'text' }
    );
  }
}
