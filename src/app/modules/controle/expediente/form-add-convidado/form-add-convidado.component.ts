import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocketService } from 'src/app/modules/socket/socket.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-form-add-convidado',
  templateUrl: './form-add-convidado.component.html',
  styleUrls: ['./form-add-convidado.component.scss']
})
export class FormAddConvidadoComponent {
  convidadoForm: FormGroup = this.fb.group({
    nome: ['', Validators.required],
    cargo: ['', Validators.required],
    assunto: ['']
   });
 
   constructor( 
     private socketService: SocketService,
     private modalService: BsModalService,
     private fb: FormBuilder
     ) { }
 
   ngOnInit(): void {
   }
 
   addConvidado(){
   
     const inscricaoStorage: any = localStorage.getItem('inscricao');
     const generateID = Math.floor(10* Math.random() + 1) + 'c'
     const convidado = {
       ID: generateID,
       name: this.convidadoForm.value.nome,
       role: this.convidadoForm.value.cargo,
       photo: 'assets/imgs/avatar-placeholder.jpg',
       party: '',
       assunto:  this.convidadoForm.value.assunto
     }
 
     if (this.convidadoForm.valid) {
       
       this.socketService.sendInscricao({
         status: 'inscricao_parada',
         timer: false,
         timerAgent: false,
         agentsIdAlreadyTalked: JSON.parse(inscricaoStorage).agentsIdAlreadyTalked,
         agentIdCurrentTime: JSON.parse(inscricaoStorage)?.agentIdCurrentTime,
         startNegative: JSON.parse(inscricaoStorage)?.startNegative,
         agents: [...JSON.parse(inscricaoStorage)?.agents, convidado]
       });
 
       this.convidadoForm.reset();
       this.closeModal();
     }
 
   }
 
   closeModal(): void {
     this.modalService.hide();
   }
}
