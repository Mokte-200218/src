import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStateService } from './services/auth-state.service';
import { AsyncPipe } from '@angular/common';



@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  protected readonly title = signal('portal-Deportivo-Cosib');
  private authState = inject(AuthStateService);
  

  forbidden$ = this.authState.forbidden$;


}
