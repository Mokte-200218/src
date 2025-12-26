import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardMetrics } from '../interfaces/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private API = 'http://localhost:8000';

  getMetrics() {
    return this.http.get<DashboardMetrics>(`${this.API}/dashboard/metrics`);
  }

  graficaGlobal() {
    return this.http.get(`${this.API}/dashboard/grafica`, {
      responseType: 'text',
    });
  }
}
