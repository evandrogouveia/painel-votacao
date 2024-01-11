import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './modules/guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
    
  },
  {
    path: 'controle',
    loadChildren: () => import('./modules/controle/controle.module').then(m => m.ControleModule),
    canActivate: [AuthGuardService],
    data: {permissao: 'admin'}
  },
  {
    path: 'painel',
    loadChildren: () => import('./modules/painel/painel.module').then(m => m.PainelModule)
  },
  {
    path: 'vereador',
    loadChildren: () => import('./modules/vereador/vereador.module').then(m => m.VereadorModule),
    canActivate: [AuthGuardService],
    data: {permissao: 'user'}
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
