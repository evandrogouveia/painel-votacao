import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControleComponent } from './controle.component';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { ExpedienteComponent } from './expediente/expediente.component';
import { OrdensComponent } from './ordens/ordens.component';
import { QuorumComponent } from './quorum/quorum.component';
import { PresidenteComponent } from './presidente/presidente.component';

const routes: Routes = [
  {
    path: '', component: ControleComponent, children: [
      { path: 'configuracoes', component: ConfiguracoesComponent },
      { path: 'expediente', component: ExpedienteComponent },
      { path: 'ordens', component: OrdensComponent },
      { path: 'presidente', component: PresidenteComponent},
      { path: 'quorum', component: QuorumComponent},
      { path: '', pathMatch: 'full', redirectTo: 'ordens' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControleRoutingModule { }
