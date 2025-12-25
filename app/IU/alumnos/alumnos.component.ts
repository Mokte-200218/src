import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AtletasService } from '../../services/atletas.service';
import { AnalisisService } from '../../services/analisis.service';
import { AuthService } from '../../services/auth.service';
import { Atleta } from '../../interfaces/atleta.model';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.scss'],
})
export class AlumnosComponent {
  private route = inject(ActivatedRoute);
  private atletasService = inject(AtletasService);
  private analisisService = inject(AnalisisService);
  private authService = inject(AuthService);
  private router = inject(Router);

  atletas: Atleta[] = [];
  deporteId!: number;

  analisisSvg = '';
  rankingSvg = '';

  rol = this.authService.getRol();

  ngOnInit() {
    this.deporteId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAtletas();
  }

  loadAtletas() {
    this.atletasService.getByDeporte(this.deporteId).subscribe(res => {
      this.atletas = res;
    });
  }

  cargarAnalisis() {
    this.analisisService.analisisDeporte(this.deporteId)
      .subscribe(svg => this.analisisSvg = svg);

    this.analisisService.rankingDeporte(this.deporteId)
      .subscribe(svg => this.rankingSvg = svg);
  }

  verAtleta(id: number) {
    this.router.navigate(['/atleta', id]);
  }

  regresarDeportes(){
    this.router.navigate(['/deportes']);
  }

  esCoordinador() {
    return this.rol === 'coordinador';
  }
}
