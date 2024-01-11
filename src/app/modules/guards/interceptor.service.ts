import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({headers: request.headers.set('Accept', 'application/json')}).clone({
      setHeaders: {
        Authorization: `${this.authService.getToken()}`
      }
    });

    return next.handle(request);
  }
}
