import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeportesService } from '../../services/deportes.service';
import { AuthService } from '../../services/auth.service';
import { Deporte } from '../../interfaces/deporte.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app/deportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deporte.component.html',
  styleUrls: ['./deporte.component.scss'],
})
export class DeportesComponent {
  private deportesService = inject(DeportesService);
  private authService = inject(AuthService);
  private router = inject(Router);

  deportes: Deporte[] = [];
  search = '';
  rol = this.authService.getRol();

  ngOnInit() {
    this.loadDeportes();
  }

  loadDeportes() {
    this.deportesService.getAll().subscribe(res => {
      this.deportes = res;
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

  eliminar(id: number) {
    if (!confirm('¿Eliminar deporte?')) return;

    this.deportesService.delete(id).subscribe(() => {
      this.loadDeportes();
    });
  }

  irAlumnos(deporteId: number) {
    this.router.navigate(['/alumnos', deporteId]);
  }

  esCoordinador(): boolean {
    return this.rol === 'coordinador';
  }
}
