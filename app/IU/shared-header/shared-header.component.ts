import { Component, inject, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header [ngClass]="themeClass">
         <img src="/cosib.svg" alt="COSIB Logo" class="logo">
      <div class="header-left">
       
        <!-- Aquí se inyectará el contenido específico de cada página -->
        <ng-content></ng-content>
      </div>

      <div class="header-right">
        <button class="btn-logout" (click)="logout()">
          Cerrar Sesión
        </button>
      </div>
    </header>
  `,
  styleUrls: ['./shared-header.component.scss']
})
export class SharedHeaderComponent {
  private authService = inject(AuthService);
  
  // Permite cambiar el color desde afuera (ej: 'theme-green', 'theme-beige')
  @Input() themeClass: string = 'theme-default';

  logout() {
    this.authService.logout();
  }
}