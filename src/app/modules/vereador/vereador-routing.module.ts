import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VereadorComponent } from './vereador.component';

const routes: Routes = [
  { path: '', component: VereadorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VereadorRoutingModule { }
