import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { DeportesService } from '../../services/deportes.service';
import { AuthService } from '../../services/auth.service';
import { Deporte, DeporteUpdateRequest } from '../../interfaces/deporte.model';
import { Router } from '@angular/router';
import { SharedHeaderComponent } from '../shared-header/shared-header.component';
import { Usuario, usuarioid, UsuarioResponse } from '../../interfaces/Usuario';
 
@Component({
  selector: 'app-deportes',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedHeaderComponent, ReactiveFormsModule],
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

  usuarios: usuarioid[] = [];
  usuarioSeleccionadoId: number | null = null;

  showUsersModal = false;
  showEditUserModal = false;

  showDeporteModal = false;
  showUsuarioModal = false;
  showAsignarModal = false;
  showActualizarDeporteForm = false;
  cargando = false;

  // Formularios
   // Formulario de edición usuario
  editUserForm = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    rol: ['coach', Validators.required],
    contrasena: ['', Validators.required],
    matricula: ['', Validators.required]
  });


  //Formulario para editar deporte
  editForm = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['']
  });
  
  //formulario para crear deporte

  sportForm = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['']
  });

  //formulario para crear usuarios
  userForm = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    rol: ['coach', Validators.required],
    contrasena: ['', Validators.required],
    matricula: ['', Validators.required]
  });

  //formularios para asignar deporte a coach
  assignForm = this.fb.group({
    usuario_id: ['', Validators.required],
    deporte_id: ['', Validators.required]
  });

  //cargar lo necesario para la UI
  ngOnInit() {
    this.loadSport();
  }

  //cargar los deportes y usuarios
 loadSport() {
  this.cargando = true;
  this.deportesService.getAll().subscribe({
    
    next: (deportes) => {
      this.deportes = deportes;
      this.cargando = false;
      this.deportesService.getUsers().subscribe(u => {
        this.coaches = u.filter(x => x.rol === 'coach'); 
      });
    this.deportesService.getAll().subscribe({
      next: (deportes) => {
        this.deportes = deportes;
        this.deportes.forEach(d => this.uploadSportImage(d));
        this.cargando = false;
      }
    });
    },
    error: () => {
      this.cargando = false;
      alert('Error al cargar deportes');
    }
  });
}

  // --- CREACIÓN ---

  // metodo para realizar la peticion POST deporte
  createSport(): void {
    if (this.sportForm.invalid) return;

    this.deportesService.createSport(this.sportForm.value as any).subscribe({
      next:(nuevoDeporte: Deporte) => {
      
        if (this.imagenSeleccionada) {
          this.deportesService.postImage(nuevoDeporte.id, this.imagenSeleccionada).subscribe({
            next: () => {
              this.finishCreateSport();
            },
            error: () => alert('Deporte creado pero error al subir imagen')
          });
        } else {
          this.finishCreateSport();
        }
      },
      error: () => alert('Error al crear deporte')
    });
  }

  // resetear los valores al terminar de crear deporte
  private finishCreateSport() {
    alert('Deporte creado exitosamente');
    this.showDeporteModal = false;
    this.imagenSeleccionada = null;
    this.loadSport();
  }

  // --- ACTUALIZACIÓN ---

  //actualizar deporte
  updateSport() {
    if (!this.deporteEditandoId || this.editForm.invalid) return;

    const datosActualizados: DeporteUpdateRequest = {
      nombre: this.editForm.value.nombre!,
      descripcion: this.editForm.value.descripcion!
    };

    // 1. Actualizar textos
    this.deportesService.updateSport(this.deporteEditandoId, datosActualizados).subscribe({
      next: () => {
        // 2. Si hay imagen nueva, actualizarla
        if (this.imagenSeleccionada) {
          this.deportesService.updateDeporteImagen(this.deporteEditandoId!, this.imagenSeleccionada).subscribe({
            next: () => this.finishUpdateSport(),
            error: () => alert('Datos actualizados pero error en la imagen')
          });
        } else {
          this.finishUpdateSport();
        }
      },
      error: () => alert('Error al actualizar datos del deporte')
    });
  }

  //resetear los valores para la proxima actualizacion
  private finishUpdateSport() {
    alert('Deporte actualizado correctamente');
    this.showActualizarDeporteForm = false;
    this.deporteEditandoId = null;
    this.imagenSeleccionada = null;
    this.loadSport();
  }

  // --- UTILIDADES ---

  //prepara la imagen ingresada
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagenSeleccionada = input.files[0];
    }
  }

  //actualiza variables para abrir el formulario de nuevo deporte
  openNew(): void {
    this.sportForm.reset();
    this.imagenSeleccionada = null;
    this.showDeporteModal = true;
  }

  //actualiza y prepara variables para abrir el formulario de edicion deporte
  openEdit(deporte: Deporte): void {
    this.deporteEditandoId = deporte.id;
    this.imagenSeleccionada = null;
    this.editForm.patchValue({
      nombre: deporte.nombre,
      descripcion: deporte.descripcion
    });
    this.showActualizarDeporteForm = true;
  }

    //actualiza y prepara variables para abrir el formulario de asignacion de coach a deporte

  assignCoach() {
  if (this.assignForm.invalid) return;

  this.deportesService.assignCoach(this.assignForm.value as any).subscribe({
    next: (res: any) => {
      // res.id es el ID de la tabla 'deporte_usuario' (la relación)
      if (res && res.id) {
        const depId = this.assignForm.value.deporte_id;
        // Guardamos el ID de la asignación usando el ID del deporte como clave
        localStorage.setItem(`coach_assignment_id_${depId}`, res.id.toString());
      }
      alert('Coach asignado exitosamente');
      this.showAsignarModal = false;
      this.loadSport();
    },
    error: () => alert('Error al asignar coach')
  });
}

  //hacer la peticion createUser y cerrar modal
  createUser() {
    if (this.userForm.invalid) return;
    this.deportesService.createUser(this.userForm.value as any).subscribe({
      next: () => {
        alert('Usuario creado correctamente');
        this.showUsuarioModal = false;
        this.loadSport();
      },
      error: () => alert('Error al crear usuario')
    });
  }

  //buscar por nombre de deporte
 searchName() {
  if (!this.search) {
    this.loadSport();
    return;
  }

  this.deportesService.getByName(this.search).subscribe({
    next: (res) => {
      this.deportes = Array.isArray(res) ? res : [res]; // Maneja si es objeto o lista
      this.deportes.forEach(d => this.uploadSportImage(d));
    },
    error: () => {
      alert('No se encontró el deporte');
      this.loadSport();
    }
  });
}

//cargar imagen de deportes
private uploadSportImage(deporte: Deporte) {
  this.deportesService.getImage(deporte.id).subscribe({
    next: (res) => {
      if (res && res.imagen_base64) {
        (deporte as any).imagenBase64 = `data:${res.imagen_tipo};base64,${res.imagen_base64}`;
      }
    },
    error: () => (deporte as any).imagenBase64 = null
  });
}

constructor (private cdr: ChangeDetectorRef){}
//eliminar deporte por id 
delete(id: number, nombre: string) {
  this.errorEliminar = null; // Limpiar errores previos
  
  if (!confirm(`¿Estás seguro de eliminar el deporte ${nombre}?`)) return;

  this.deportesService.delete(id).subscribe({
    next: () => {
      this.loadSport();
      // Opcional: un alert de éxito
    },
    error: (err) => {
      console.log('Error recibido:', err); // Revisa esto en la consola (F12)
      this.errorEliminar = err.error?.detail || `No se puede eliminar ${nombre}: tiene un coach asignado o alumnos inscritos.`; 
      // FORZAR LA ACTUALIZACIÓN DE LA VISTA AQUÍ
      this.cdr.detectChanges();
      setTimeout(() => {
        this.errorEliminar = null;
        this.cdr.detectChanges(); 
      }, 5000);
    }
  });
}

  // ir a la interfaz de los atletas del deporte
  goStudents(deporteId: number) {
    this.router.navigate(['/alumnos', deporteId]);
  }

  // Abrir lista de usuarios
  openUsersList() {
    this.showUsersModal = true;
    this.loadAllUsers();
  }

  loadAllUsers() {
    this.deportesService.getUsersObservable().subscribe({
      next: (data) => this.usuarios = data,
      error: () => alert('Error al cargar la lista de usuarios')
    });
  }

  // Abrir modal de edición prellenado
  openEditUser(id: number) {
    this.usuarioSeleccionadoId = id;
    this.deportesService.getUserById(id).subscribe({
      next: (user) => {
        this.editUserForm.patchValue({
          nombre: user.nombre,
          correo: user.correo,
          rol: user.rol,
          matricula: user.matricula,
          contrasena: '' // Por seguridad se suele dejar vacío para nueva entrada
        });
        this.showEditUserModal = true;
      }
    });
  }

  confirmUpdateUser() {
    if (this.editUserForm.invalid || !this.usuarioSeleccionadoId) return;

    this.deportesService.updateUser(this.usuarioSeleccionadoId, this.editUserForm.value as Usuario).subscribe({
      next: () => {
        alert('Usuario actualizado con éxito');
        this.showEditUserModal = false;
        this.loadAllUsers(); // Refrescar la lista del primer modal
      },
      error: () => alert('Error al actualizar usuario')
    });
  }

  confirmDeleteUser(id: number, nombre: string) {
    if (!confirm(`¿Estás seguro de desactivar al usuario ${nombre}?`)) return;

    this.deportesService.deleteUser(id).subscribe({
      next: () => {
        alert('Usuario eliminado (marcado como inactivo)');
        this.loadAllUsers();
      },
      error: () => alert('Error al eliminar usuario')
    });
  }

  // verificar que el usuario sea coordinador
  isCoordinator(): boolean {
    return this.rol === 'coordinador';
  }
}