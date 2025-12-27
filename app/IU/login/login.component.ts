import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, NgForm, NgModel, NgModelGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = ChangeDetectorRef;

  loading = false;
  error = '';

  loginForm = this.fb.nonNullable.group({
    identifier: ['', Validators.required],
    contrasena: ['', Validators.required],
  });

  submit() {
    if (this.loginForm.invalid || this.loading) return;

    this.loading = true;
    this.error = '';

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.router.navigate(['/deportes']);
      },
      error: () => {
        this.loading = false; 
        this.error = 'Correo o contraseña erroneo';
          
      },
      
    });
  }
}
