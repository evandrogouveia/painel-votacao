import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VereadorRoutingModule } from './vereador-routing.module';
import { VereadorComponent } from './vereador.component';


@NgModule({
  declarations: [
    VereadorComponent
  ],
  imports: [
    CommonModule,
    VereadorRoutingModule
  ]
})
export class VereadorModule { }
