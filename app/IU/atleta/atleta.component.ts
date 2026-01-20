import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AtletasService } from '../../services/atletas.service';
import { AtletaCreateRequest, Avance } from '../../interfaces/atleta.model';
import { CommonModule } from '@angular/common';
import { SharedHeaderComponent } from '../shared-header/shared-header.component';
import { Deporte } from '../../interfaces/deporte.model';
import { DocumentoAtleta } from '../../interfaces/documento-atleta.model';

   
@Component({
  selector: 'app-atleta-detalle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedHeaderComponent],
  templateUrl: './atleta.component.html',
  styleUrls: ['./atleta.component.scss']
})
export class AtletaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private atletasService = inject(AtletasService);
  private fb = inject(FormBuilder);
  private sanitizer = inject(DomSanitizer);
 

  nombreDeporte!: string;
  atletaId!: number;
  atleta?: AtletaCreateRequest;
  avances: Avance[] = [];
  deporteActual?: Deporte;
  avanceEditandoId: number | null | undefined = null; 
   documentos: DocumentoAtleta[] = [];
  analisisSvg: SafeHtml | null = null;
  
  showEditAtletaModal = false;
  showAvanceModal = false;
  showAnalisisModal = false;

  // Formularios
  atletaForm = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    matricula: ['', Validators.required],
    fecha_nacimiento: [''],
    peso: [0],
    altura: [0],
    activo: [true],
    deporte_id: [0]
  });

  avanceForm = this.fb.group({
    atleta_id: [0],
    descripcion_avance: ['', Validators.required],
    fecha_avance: [new Date().toISOString(), Validators.required],
    distancia_salto_largo: [0],
    distancia_salto_vertical: [0],
    fuerza_sentadilla_max: [0],
    fuerza_press_pecho_max: [0],
    fuerza_peso_muerto_max: [0],
    repeticiones_dominadas_max: [0],
    repeticiones_lagartijas_max: [0],
    repeticiones_abdominales_1min: [0],
    potencia_salto_vertical_cmj: [0],
    potencia_salto_horizontal: [0],
    potencia_sprint_10m: [0],
    potencia_sprint_20m: [0]
  });

  //cargar al iniciar
  ngOnInit() {
    this.atletaId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
  }

  //preparar informacion 
  loadData() {
    this.atletasService.getByAtleta(this.atletaId).subscribe((a:AtletaCreateRequest) => {
      this.atleta = a as any;
      this.atletaForm.patchValue(a);
        // CARGAR INFO DEL DEPORTE usando el deporte_id del atleta
      if (a.deporte_id) {
        this.atletasService.getInfoDeporteById(a.deporte_id).subscribe(d => {
          this.deporteActual = d;
        });
      }
    });
    this.atletasService.getAvancesByAtleta(this.atletaId).subscribe(av => this.avances = av);
    this.atletasService.getDocumentosByAtleta(this.atletaId).subscribe(docs => {
      this.documentos = docs;
    });
  }

  //obtener los documentos del atleta
   getDocByTipo(tipo: 'permiso_tutor' | 'permiso_medico'): DocumentoAtleta | undefined {
    return this.documentos.find(d => d.tipo === tipo);
  }
  
  //actualizar informacion del atleta
  updateAthlete() {
    if (this.atletaForm.invalid) return;
    this.atletasService
      .updateAtleta(this.atletaId, this.atletaForm.value as any)
      .subscribe({
        next: () => {
          alert('Información del alumno actualizada');
          this.showEditAtletaModal = false;
          this.loadData();
        },
        error: () => alert('Error al actualizar alumno')
      });
  }


  // --- LÓGICA DE DOCUMENTOS ---
  //preparar actualizacion de documentos
  onUploadFile(event: any, tipo: 'permiso_tutor' | 'permiso_medico') {
    const file = event.target.files[0];
    if (file) {
      this.atletasService.uploadDocumento(this.atletaId, tipo, file).subscribe({
        next: () => {
          alert('Documento subido');
          this.loadData();
        },
        error: () => alert('Error al subir documento')
      });
    }
  }

  //descargar documentos
  uploadDoc(doc: DocumentoAtleta) {
    this.atletasService.downloadDocumento(this.atletaId, doc.id).subscribe({
      next: (res: any) => {
        //Extraemos cotenido del Base64 del objeto JSON
        // Revisa en tu Network si la clave es 'permiso_base64' o 'archivo'
        const base64Real = res.permiso_base64 || res.base64 || res.archivo;

        if (base64Real) {
          //Llamar a la función de descarga con el string puro
          this.atletasService.descargarBase64(base64Real, doc.permiso_nombre);
        } else {
          console.error('El JSON no contiene una propiedad de base64 conocida:', res);
          alert('El archivo está vacío o el formato es incorrecto.');
        }
      },
      error: (err) => {
        console.error('Error al descargar:', err);
        alert('Error de conexión con el servidor.');
      }
    });
  }


   // Lógica para eliminar documento
  deleteDoc(docId: number) {
    if (!confirm('¿Estás seguro de eliminar este documento?')) return;
    this.atletasService.deleteDocumento(this.atletaId, docId).subscribe({
      next: () => {
        alert('Documento eliminado correctamente');
        this.loadData(); // Refrescamos la lista
      },
      error: () => alert('Error al eliminar')
    });
  }


  // --- LÓGICA DE AVANCES ---

  //preparar formulario para registrar avance del atleta
  openNewModalPreview() {
    this.avanceEditandoId = null;
    this.avanceForm.reset({
      fecha_avance: new Date().toISOString().substring(0, 10), 
      atleta_id: this.atletaId
    });
    this.showAvanceModal = true;
  }
 
  //preparar formulario para editar avance del atleta
  openEditModalPreview(avance: Avance) {
    this.avanceEditandoId = avance.id;
    this.avanceForm.patchValue(avance as any);
    this.showAvanceModal = true;
  }

  //guardar avance del atleta
  saveProgress() {
    if (this.avanceForm.invalid) return;
    const payload = { ...this.avanceForm.getRawValue(), atleta_id: this.atletaId };

    if (this.avanceEditandoId) {
      // ACTUALIZAR (PUT)
      this.atletasService.updateAvance(this.avanceEditandoId, payload as any).subscribe({
        next: () => this.finishProgress('Avance actualizado'),
        error: () => alert('Error al actualizar avance')
      });
    } else {
      // CREAR (POST)
      this.atletasService.createAvance(payload as any).subscribe({
        next: () => this.finishProgress('Avance registrado'),
        error: () => alert('Error al crear avance')
      });
    }
  }

 
  //eliminar avance del atleta
  deleteProgress(id: number | undefined) {
    if (!id) return; 
    if (!confirm('¿Seguro que deseas eliminar este registro de avance?')) return;
    this.atletasService.deleteAvance(id).subscribe({
      next: () => {
        console.error('Error al eliminar avance:');
        alert('No se pudo eliminar el registro. Intente de nuevo.');
      },
      error: (err) => {
        alert('Registro eliminado correctamente');
        this.loadData(); 
      } 
    });
  }

  // reiniciar valores al terminar de registrar avance
  private finishProgress(msg: string) {
    alert(msg);
    this.showAvanceModal = false;
    this.loadData();
  }
    
  // --- ANÁLISIS ---
  //obtener los analisis SVG
  seeAnalysis() {
    this.atletasService.getAnalisisSvg(this.atletaId).subscribe({
      next: (res) => {
        // extraer el string Base64 del objeto (res.graficas.Fuerza)
        const base64String = res.graficas.Fuerza;

        if (base64String) {
          // decodificar de Base64 a texto plano (SVG XML)
          const svgDecodificado = atob(base64String);

          // pasar por el sanitizer para que Angular lo acepte en el [innerHTML]
          this.analisisSvg = this.sanitizer.bypassSecurityTrustHtml(svgDecodificado);
          
          // mostrar el modal
          this.showAnalisisModal = true;
        }
      },
      error: (err) => {
        console.error('Error al obtener la gráfica:', err);
        alert('No se pudo cargar el análisis gráfico.');
      }
    });
  }

  //regresa a la vista de alumnos
  return() {
    this.router.navigate(['/alumnos/',this.deporteActual?.id]);
  }
}