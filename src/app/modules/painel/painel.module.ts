import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PainelRoutingModule } from './painel-routing.module';
import { PainelComponent } from './painel.component';
import { GlobalTimerModule } from '../global-timer/global-timer.module';


@NgModule({
  declarations: [
    PainelComponent
  ],
  imports: [
    CommonModule,
    PainelRoutingModule,
    GlobalTimerModule
  ]
})
export class PainelModule { }
