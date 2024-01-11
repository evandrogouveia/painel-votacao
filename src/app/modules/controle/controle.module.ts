import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControleRoutingModule } from './controle-routing.module';
import { ControleComponent } from './controle.component';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { ExpedienteComponent } from './expediente/expediente.component';
import { OrdensComponent } from './ordens/ordens.component';
import { QuorumComponent } from './quorum/quorum.component';
import { NgxBootstrapModule } from 'src/app/ngx-bootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalTimerModule } from '../global-timer/global-timer.module';
import { SharedModule } from '../shared/shared.module';
import { PresidenteComponent } from './presidente/presidente.component';
import { OrdemDetalhesComponent } from './ordens/ordem-detalhes/ordem-detalhes.component';


@NgModule({
  declarations: [
    ControleComponent,
    ConfiguracoesComponent,
    ExpedienteComponent,
    OrdensComponent,
    QuorumComponent,
    PresidenteComponent,
    OrdemDetalhesComponent,
    
  ],
  imports: [
    CommonModule,
    ControleRoutingModule,
    NgxBootstrapModule,
    FormsModule,
    ReactiveFormsModule,
    GlobalTimerModule,
    SharedModule,
    
  ]
})
export class ControleModule { }
