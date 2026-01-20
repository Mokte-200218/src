import { Component, inject,OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AtletasService } from '../../services/atletas.service';
import { AuthService } from '../../services/auth.service';
import { Atleta, AtletaCreateRequest } from '../../interfaces/atleta.model';
import { SharedHeaderComponent } from '../shared-header/shared-header.component';
import { DeporteUsuario,DeporteUsuarioRequest } from '../../interfaces/deporte-usuario';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Usuario } from '../../interfaces/Usuario';
import { DeportesService } from '../../services/deportes.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // Importar Sanitizer
import { Deporte } from '../../interfaces/deporte.model';

@Component({
  standalone: true,
  imports: [CommonModule, SharedHeaderComponent, ReactiveFormsModule],
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.scss'],
})
export class AlumnosComponent implements OnInit{
  private route = inject(ActivatedRoute);
  private atletasService = inject(AtletasService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private deportesService = inject(DeportesService);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  coachAsignado: DeporteUsuario | null = null;
  atletas: Atleta[] = [];
  coaches: Usuario[] = [];
 
  deporteInfo?:Deporte;
  deporteId!: number;
  cargando = false;

  analisisSvgSafe: SafeHtml | null = null;
  rankingSvgSafe: SafeHtml | null = null;
   
  showCrearAtletaModal = false;
  showEditarCoachModal = false;

  showGraficasModal = false;
  graficaVisible: 'analisis' | 'ranking' = 'analisis'; // Controla cuál se ve
  atletaForm!: FormGroup;
  editarCoachForm!: FormGroup;

  rol = this.authService.getRol();

 
 
  //cargar al entrar
  ngOnInit(): void {
      //obtiene el id del deporte al cual se le dio click 
      //    y lo guarda en la variable global deporteID
    this.deporteId = Number(this.route.snapshot.paramMap.get('id'));
    this.initFormularios();
    this.loadAll();
      }
  //logica para cargar graficas
  loadGraphics() {
    this.cargando = true;
    this.atletasService.getGraficaDeporte(this.deporteId).subscribe({
      next: (res: any) => {
              console.log('Datos recibidos de Análisis:', res); // <--- identificar el nombre del documento
        const base64 = res.graficas?.grafica_progresion || res.grafica_progresion || res.base64;
        if (base64) {
          const decoded = atob(base64); // Decodificar Base64 -> XML SVG
          this.analisisSvgSafe = this.sanitizer.bypassSecurityTrustHtml(decoded);
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        alert('No se pudo cargar la gráfica de rendimiento general.');
      }
    });

    // otener gráfica de Ranking
    this.atletasService.getGraficaRanking(this.deporteId).subscribe({
      next: (res: any) => {
                      console.log('Datos recibidos de Análisis:', res); // <--- MIRA ESTO EN CONSOLA

        const base64 = res.grafica_svg || res.graficas?.grafica_svg || res.base64;
        
        if (base64) {
          const decoded = atob(base64);
          this.rankingSvgSafe = this.sanitizer.bypassSecurityTrustHtml(decoded);
        }
        this.cdr.detectChanges();
      }
    });
  }


  //modal para las graficas
  openModalGraph(tipo: 'analisis' | 'ranking') {
    this.graficaVisible = tipo;
    this.showGraficasModal = true;
    if (!this.analisisSvgSafe || !this.rankingSvgSafe) {
      this.loadGraphics();
    }
  }

  //iniciar formularios
  private initFormularios() {
    this.atletaForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      matricula: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      peso: [0, Validators.required],
      altura: [0, Validators.required],
      activo: [true]
    });

    this.editarCoachForm = this.fb.group({
      usuario_id: ['', Validators.required],
      deporte_id: [this.deporteId, Validators.required]
    });
  }

  //abre modal para crear atletas
  abrirCrearAtleta() {
    this.atletaForm.reset({ activo: true });
    this.showCrearAtletaModal = true;
  } 
    
  //llena formulario crear atleta
  openCreateAthlete() {
    if (this.atletaForm.invalid) return;

    const payload: AtletaCreateRequest = {
      ...this.atletaForm.value,
      deporte_id: this.deporteId
    };

    this.atletasService.create(payload).subscribe({
      next: () => {
        alert('Atleta creado correctamente');
        this.showCrearAtletaModal = false;
        this.loadAthlete();
      },
      error: () => alert('Error al crear atleta')
    });
  }

  //cargar atletas
  loadAthlete() {
    this.atletasService.getByDeporte(this.deporteId).subscribe(a => {
      this.atletas = a;
    });
  }
   

  //verificar que el usuario sea coordinador
  isCoordinator() {
    return this.rol === 'coordinador';
  }

 
   //en mantenimiento, para realizar asignacion
   //cargar informacion del entrenador correspondiente
  loadCoachInfo() {
    if (!this.deporteId) return;
    this.atletasService.getAsignacionesPorDeporte(this.deporteId).subscribe({
      next: (res: any) => {
        // Si el back devuelve lista, tomamos el primero para obtener el .id de la relación
        const asignacion = Array.isArray(res) ? res[0] : res;
        if (asignacion && asignacion.id) {
          this.coachAsignado = asignacion;
          this.editarCoachForm.patchValue({
            usuario_id: asignacion.usuario_id
          });
        } else {
          this.coachAsignado = null;
        }
      },
      error: () => this.coachAsignado = null
    });
  }

  //funcion para actualizar coach
  updateCoach() {
    if (!this.coachAsignado || !this.coachAsignado.id) {
      alert('No hay una asignación válida para actualizar');
      return;
    }
    if (this.editarCoachForm.invalid) return;

    this.atletasService.actualizarAsignacion(this.coachAsignado.id, this.editarCoachForm.value).subscribe({
      next: () => {
        alert('Asignación actualizada');
        this.showEditarCoachModal = false;
        this.loadCoachInfo();
      },
      error: (err) => alert('Error al actualizar: ' + (err.error?.detail || 'Intente de nuevo'))
    });
  }

  //eliminar asignacion
  deleteAssignment() {
    if (!this.coachAsignado || !this.coachAsignado.id) return;
    if (!confirm('¿Eliminar asignación actual?')) return;

    this.atletasService.eliminarAsignacion(this.coachAsignado.id).subscribe({
      next: () => {
        this.coachAsignado = null;
        this.showEditarCoachModal = false;
        alert('Coach desasignado');
      }
    });
  }


  //función de apoyo asignacioncon protección 
  getAllocationDetails(id: number | undefined) {
    if (!id) return; 

    this.atletasService.getAsignacionPorId(id).subscribe(detalle => {
      this.coachAsignado = detalle;
    });
  }

  //preparar el modal para editar coach
  openEdithCoach() {
    this.showEditarCoachModal = true;
    this.deportesService.getUsers().subscribe(u => {
      this.coaches = u.filter(x => x.rol === 'coach');
      if (this.coachAsignado) {
        this.editarCoachForm.patchValue({
          usuario_id: this.coachAsignado.usuario_id
        });
      }
    });
  }

  //cargar lo necesario
  loadAll() {
    this.loadAthlete();
    this.loadCoachInfo();
    this.getSportDetails();
  }


  // otener los detalles del deporte
  getSportDetails() {
    if (!this.deporteId) return;
    this.atletasService.getInfoDeporteById(this.deporteId).subscribe({
      next: (data) => {
        this.deporteInfo = data;
      },
      error: (err) => {
        console.error('Error al obtener info del deporte:', err);
      }
    });
  }
  
  //eliminar atleta
  deleteAthlete(id: number) {
    if (!confirm('¿Eliminar atleta?')) return;
    this.atletasService.delete(id).subscribe(() => {
      this.loadAll();
    });
  }
  
  //dirigirse a la informacion del atleta
  goAthlete(id: number) {
    this.router.navigate(['/atleta', id]);
  }

  //regresar a la  vista de deportes
  returnSports(){
    this.router.navigate(['/deportes']);
  }


}
