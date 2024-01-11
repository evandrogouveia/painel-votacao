import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { FormAddConvidadoComponent } from '../controle/expediente/form-add-convidado/form-add-convidado.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ModalComponent,
    FormAddConvidadoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ModalComponent,
    FormAddConvidadoComponent
  ]
})
export class SharedModule { }
