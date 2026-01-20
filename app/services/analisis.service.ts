import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnalisisService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8000';

  //Contruir URL para obtener grafica SVG de un deporte en especifico
  analisisDeporte(deporteId: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/analisis/deporte/${deporteId}`);
  }
 
  //Contruir URL para obtener grafica SVG de ranking de atletas por deporte
 rankingDeporte(deporteId: number, limit = 10): Observable<any> {
    return this.http.get<any>(
      `${this.API_URL}/analisis/ranking/deporte/${deporteId}?limit=${limit}`
    );
  }
} 
