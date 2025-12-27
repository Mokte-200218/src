import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login, LoginResponse } from '../interfaces/Login';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000';

   private router = inject(Router);

  login(data: Login) {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/login`, data)
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.access_token);
          localStorage.setItem('rol', res.rol);
          localStorage.setItem('user_id', String(res.user_id));
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  //CERRAR SESION
  logout() {
    localStorage.removeItem('token');
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
