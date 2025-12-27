import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthStateService {

  private forbiddenSubject = new BehaviorSubject<string | null>(null);
  forbidden$ = this.forbiddenSubject.asObservable();

  setForbidden(message: string) {
    this.forbiddenSubject.next(message);
  }

  clearForbidden() {
    this.forbiddenSubject.next(null);
  }
}
