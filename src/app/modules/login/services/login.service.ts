import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../guards/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/register`, user)
      .pipe(
        retry(1),
        map(res => {
          this.authService.setDataInLocalStorage('token', res.token);
          this.authService.logged.next(true);
          res.data.permissao === 'admin' ? this.router.navigate(['/controle/ordens']) : this.router.navigate(['/vereador']);
        }),
        catchError(this.handleError)
      );
  }

  login(user: any): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/login`, user)
      .pipe(
        retry(1),
        map(res => {
          this.authService.setDataInLocalStorage('token', res.token);
          this.authService.logged.next(true);
          console.log(res)
          res.data.permissao === 'admin' ? this.router.navigate(['/controle/ordens']) : this.router.navigate(['/vereador']);
        }),
        catchError(this.handleError)
      );
  }

  getUser(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/user`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getUserAll(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/user-all`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  deleteUser(userID: any): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}/user/${userID}`)
    .pipe(
      retry(1),
      map(() => {
        this.authService.clearStorage();
        this.authService.logged.next(false);
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.http.post<any>(`${environment.API_URL}/logout`, {})
        .subscribe(res => {
          this.authService.setDataInLocalStorage('token', res.token);
          this.authService.clearStorage();
          this.authService.logged.next(false);
          this.router.navigate(['/']);
        });
  }

  handleError(error: any): Observable<any> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = error.error;
    }
    return throwError(errorMessage);
  }
}
