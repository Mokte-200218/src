import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ExportacionesService {
  private http = inject(HttpClient);
  private API = 'http://localhost:8000';

  exportCSV() {
    return this.http.get(`${this.API}/export/csv`, {
      responseType: 'blob',
    });
  }

  exportPDF() {
    return this.http.get(`${this.API}/export/pdf`, {
      responseType: 'blob',
    });
  }
}
