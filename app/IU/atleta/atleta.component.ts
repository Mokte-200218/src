import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AtletasService } from '../../services/atletas.service';
import { DocumentosService } from '../../services/documentos.service';
import { RendimientoService } from '../../services/rendimiento.service';
import { AuthService } from '../../services/auth.service';
import { Atleta } from '../../interfaces/atleta.model';
import { Documento } from '../../interfaces/documento.model';


@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './atleta.component.html',
  styleUrls: ['./atleta.component.scss'],
})
export class AtletaComponent {
  private route = inject(ActivatedRoute);
  private atletasService = inject(AtletasService);
  private documentosService = inject(DocumentosService);
  private rendimientoService = inject(RendimientoService);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  atleta!: Atleta;
  documentos: Documento[] = [];
  svgRendimiento = '';

  atletaId!: number;
  rol = this.authService.getRol();

  ngOnInit() {
    this.atletaId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAtleta();
    this.loadDocumentos();
  }
  regresarAlumnos(){
    this.router.navigate(['/deportes']);
  }

  loadAtleta() {
    this.atletasService.getById(this.atletaId)
      .subscribe(res => this.atleta = res);
  }

  loadDocumentos() {
    this.documentosService.getByAtleta(this.atletaId)
      .subscribe(res => this.documentos = res);
  }

  cargarRendimiento() {
    this.rendimientoService.graficaAtleta(this.atletaId)
      .subscribe(svg => this.svgRendimiento = svg);
  }

  subirDocumento(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.documentosService.upload(this.atletaId, input.files[0])
      .subscribe(() => this.loadDocumentos());
  }

  eliminarDocumento(id: number) {
    this.documentosService.delete(id)
      .subscribe(() => this.loadDocumentos());
  }

  esCoordinador() {
    return this.rol === 'coordinador';
  }
}
