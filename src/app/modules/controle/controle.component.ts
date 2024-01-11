import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators'
import { LoginService } from '../login/services/login.service';

@Component({
  selector: 'app-controle',
  templateUrl: './controle.component.html',
  styleUrls: ['./controle.component.scss']
})
export class ControleComponent {
  currentRoute: string = '';
  icon: string = '';

  constructor(private router: Router, private loginService: LoginService) {
    this.router.events.pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
      
        switch (event.url) {
          case '/controle':
            this.currentRoute = 'Ordens';
            this.icon = 'bx-detail';
            break;
          case '/controle/ordens':
            this.currentRoute = 'Ordens';
            this.icon = 'bx-detail';
            break;
          case '/controle/expediente':
            this.currentRoute = 'Expediente';
            this.icon = 'bx-microphone';
            break;
          case '/controle/presidente':
            this.currentRoute = 'Presidente';
            this.icon = 'bx-user-pin';
            break;
          case '/controle/configuracoes':
            this.currentRoute = 'Configurações';
            this.icon = 'bx-cog';
            break;
        }
      });
  }

  logout() {
    this.loginService.logout();
  }

}
