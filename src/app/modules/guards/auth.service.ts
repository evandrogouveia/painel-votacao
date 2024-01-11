import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public logged = new BehaviorSubject<boolean>(false);

  constructor() {
    this.verifyToken();
   }

  setDataInLocalStorage(dataName: any, data: any): void {
    localStorage.setItem(dataName, data);
  }

  getToken(): any{
    return localStorage.getItem('token');
  }

  verifyToken(): any {
    if (this.getToken()) {
      this.logged.next(true);
    } else {
      this.logged.next(false);
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.logged.asObservable();
  }

  clearStorage(): void {
    localStorage.clear();
  }
}
