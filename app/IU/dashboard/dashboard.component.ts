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

  //cargar al iniciar
  ngOnInit() {
    this.loadMetrics();
  }

  //cargar metricas de evaluacion
  loadMetrics() {
    this.dashboardService.getMetrics()
      .subscribe(res => this.metrics = res);
  }

  //cargar graficas
  loadGrafic() {
    this.dashboardService.graficaGlobal()
      .subscribe(svg => this.svgGlobal = svg);
  }

  //descargar formatos CSV
  downloadCsv() {
    this.exportService.exportCSV().subscribe(blob => {
      this.download(blob, 'reporte.csv');
    });
  }

  // descargar documentos PDF
  downloadPDF() {
    this.exportService.exportPDF().subscribe(blob => {
      this.download(blob, 'reporte.pdf');
    });
  }

  //convertir a formato descargable desde el navegador
  download(blob: Blob, nombre: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  //verificar que el usuario sea coordinador
  isCoordinator() {
    return this.rol === 'coordinador';
  }
}
