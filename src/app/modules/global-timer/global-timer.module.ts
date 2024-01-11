import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalTimerComponent } from './global-timer.component';



@NgModule({
  declarations: [
    GlobalTimerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GlobalTimerComponent
  ]
})
export class GlobalTimerModule { }
