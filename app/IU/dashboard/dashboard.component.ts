import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { ExportacionesService } from '../../services/exportaciones.service';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  private dashboardService = inject(DashboardService);
  private exportService = inject(ExportacionesService);
  private authService = inject(AuthService);

  metrics: any;
  svgGlobal = '';
  rol = this.authService.getRol();

  ngOnInit() {
    this.loadMetrics();
  }

  loadMetrics() {
    this.dashboardService.getMetrics()
      .subscribe(res => this.metrics = res);
  }

  cargarGrafica() {
    this.dashboardService.graficaGlobal()
      .subscribe(svg => this.svgGlobal = svg);
  }

  descargarCSV() {
    this.exportService.exportCSV().subscribe(blob => {
      this.descargar(blob, 'reporte.csv');
    });
  }

  descargarPDF() {
    this.exportService.exportPDF().subscribe(blob => {
      this.descargar(blob, 'reporte.pdf');
    });
  }

  descargar(blob: Blob, nombre: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  esCoordinador() {
    return this.rol === 'coordinador';
  }
}
