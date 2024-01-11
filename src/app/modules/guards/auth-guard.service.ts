import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    if (this.authService.getToken()) {
      const dataToken: any = decode(this.authService.getToken());
      if (dataToken.data.permissao === route.data['permissao']) {
        return true;
      }
    }
    this.router.navigate(['/']);
    return false;
  }
}
