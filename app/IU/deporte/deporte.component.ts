import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { DeportesService } from '../../services/deportes.service';
import { AuthService } from '../../services/auth.service';
import { Deporte, DeporteUpdateRequest } from '../../interfaces/deporte.model';
import { Router } from '@angular/router';
import { SharedHeaderComponent } from '../shared-header/shared-header.component';
import { Usuario } from '../../interfaces/Usuario';

@Component({
  selector: 'app-deportes',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedHeaderComponent, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './deporte.component.html',
  styleUrls: ['./deporte.component.scss'],
})
export class DeportesComponent implements OnInit {
  private deportesService = inject(DeportesService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  errorEliminar: string | null = null;

  deportes: Deporte[] = [];
  coaches: Usuario[] = [];
  search = '';
  rol = this.authService.getRol();
  deporteEditandoId: number | null = null;
  imagenSeleccionada: File | null = null;

  showDeporteModal = false;
  showUsuarioModal = false;
  showAsignarModal = false;
  showActualizarDeporteForm = false;
  cargando = false;

  // Formularios
  editarForm = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['']
  });

  deporteForm = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['']
  });

  usuarioForm = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    rol: ['coach', Validators.required],
    contrasena: ['', Validators.required],
    matricula: ['', Validators.required]
  });

  asignarForm = this.fb.group({
    usuario_id: ['', Validators.required],
    deporte_id: ['', Validators.required]
  });

  ngOnInit() {
    this.loadDeportes();
  }

 loadDeportes() {
  this.cargando = true;
  this.deportesService.getAll().subscribe({
    
    next: (deportes) => {
      this.deportes = deportes;
      this.cargando = false;
      this.deportesService.getUsuarios().subscribe(u => {
        this.coaches = u.filter(x => x.rol === 'coach'); // <--- MIRA AQUÍ
      });

      this.deportes.forEach(deporte => {
        this.deportesService.obtenerImagen(deporte.id).subscribe({
          next: (res) => {
            // 'res' ahora es el objeto JSON que viste en el error
            if (res && res.imagen_base64) {
              // Usamos el tipo de imagen que viene del backend (imagen_tipo)
              // y el contenido real (imagen_base64)
              (deporte as any).imagenBase64 = `data:${res.imagen_tipo};base64,${res.imagen_base64}`;
            }
          },
          error: () => {
            // Si da 404 es porque el deporte no tiene imagen, no es un error grave
            (deporte as any).imagenBase64 = null;
          }
        });
      });
    },
    error: () => {
      this.cargando = false;
      alert('Error al cargar deportes');
    }
  });
}

  // --- CREACIÓN ---
  crearDeporte(): void {
    if (this.deporteForm.invalid) return;

    this.deportesService.crearDeporte(this.deporteForm.value as any).subscribe({
      next:(nuevoDeporte: Deporte) => {
        // Si hay una imagen, la subimos usando el ID del deporte recién creado
        if (this.imagenSeleccionada) {
          this.deportesService.subirImagen(nuevoDeporte.id, this.imagenSeleccionada).subscribe({
            next: () => {
              this.finalizarCreacion();
            },
            error: () => alert('Deporte creado pero error al subir imagen')
          });
        } else {
          this.finalizarCreacion();
        }
      },
      error: () => alert('Error al crear deporte')
    });
  }

  private finalizarCreacion() {
    alert('Deporte creado exitosamente');
    this.showDeporteModal = false;
    this.imagenSeleccionada = null;
    this.loadDeportes();
  }

  // --- ACTUALIZACIÓN ---
  actualizarDeporte() {
    if (!this.deporteEditandoId || this.editarForm.invalid) return;

    const datosActualizados: DeporteUpdateRequest = {
      nombre: this.editarForm.value.nombre!,
      descripcion: this.editarForm.value.descripcion!
    };

    // 1. Actualizar textos
    this.deportesService.updateDeporte(this.deporteEditandoId, datosActualizados).subscribe({
      next: () => {
        // 2. Si hay imagen nueva, actualizarla
        if (this.imagenSeleccionada) {
          this.deportesService.updateDeporteImagen(this.deporteEditandoId!, this.imagenSeleccionada).subscribe({
            next: () => this.finalizarActualizacion(),
            error: () => alert('Datos actualizados pero error en la imagen')
          });
        } else {
          this.finalizarActualizacion();
        }
      },
      error: () => alert('Error al actualizar datos del deporte')
    });
  }

  private finalizarActualizacion() {
    alert('Deporte actualizado correctamente');
    this.showActualizarDeporteForm = false;
    this.deporteEditandoId = null;
    this.imagenSeleccionada = null;
    this.loadDeportes();
  }

  // --- UTILIDADES ---
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagenSeleccionada = input.files[0];
    }
  }

  abrirNuevo(): void {
    this.deporteForm.reset();
    this.imagenSeleccionada = null;
    this.showDeporteModal = true;
  }

  abrirEditar(deporte: Deporte): void {
    this.deporteEditandoId = deporte.id;
    this.imagenSeleccionada = null;
    this.editarForm.patchValue({
      nombre: deporte.nombre,
      descripcion: deporte.descripcion
    });
    this.showActualizarDeporteForm = true;
  }

  asignarCoach() {
    if (this.asignarForm.invalid) return;
    this.deportesService.asignarCoach(this.asignarForm.value as any).subscribe({
      next: () => {
        alert('Coach asignado exitosamente');
        this.showAsignarModal = false;
      },
      error: () => alert('Error al asignar coach')
    });
  }

  crearUsuario() {
    if (this.usuarioForm.invalid) return;
    this.deportesService.crearUsuario(this.usuarioForm.value as any).subscribe({
      next: () => {
        alert('Usuario creado correctamente');
        this.showUsuarioModal = false;
        this.loadDeportes();
      },
      error: () => alert('Error al crear usuario')
    });
  }

  buscar() {
    if (!this.search) {
      this.loadDeportes();
      return;
    }
    this.deportesService.getByNombre(this.search).subscribe(res => {
      this.deportes = [res];
    });
  }

  eliminar(id: number, nombre: string) {
  this.errorEliminar = null; // Limpiar errores previos
  if (!confirm('¿Eliminar deporte?')) return;
  this.deportesService.delete(id).subscribe({
    next: () => {  this.loadDeportes();},
    error: (err) => {
      this.errorEliminar = err.error?.detail || 'Error al eliminar, coach asignado o alumnos incritos en ' + nombre;
      
      // Desaparecer el error después de 5 segundos
      setTimeout(() => this.errorEliminar = null, 2000
      
    );
      
    }
  });
}

  irAlumnos(deporteId: number) {
    this.router.navigate(['/alumnos', deporteId]);
  }

  esCoordinador(): boolean {
    return this.rol === 'coordinador';
  }
}