import { Routes } from '@angular/router';
import { LoginComponent } from './IU/login/login.component';
import { DeportesComponent } from './IU/deporte/deporte.component';
import { DashboardComponent } from './IU/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Iniciar sesion' },

  { path: 'deportes', component: DeportesComponent, title: 'Deportes'},
  {
  path: 'alumnos/:id',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./IU/alumnos/alumnos.component')
      .then(m => m.AlumnosComponent),
  },
  {
    path: 'atleta/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./IU/atleta/atleta.component')
        .then(m => m.AtletaComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
    import('./IU/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),

  },


  { path: '**', redirectTo: 'login' }
];
