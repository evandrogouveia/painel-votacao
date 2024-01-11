import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { ModalComponent } from '../../shared/modal/modal.component';
import { SocketService } from '../../socket/socket.service';

@Component({
  selector: 'app-ordens',
  templateUrl: './ordens.component.html',
  styleUrls: ['./ordens.component.scss']
})
export class OrdensComponent implements OnInit  {

  session: any = [];
  bsModalRef?: BsModalRef;
  dadosQuorum$: Observable<any> = of();

  constructor(
    private modalService: BsModalService,
    private socketService: SocketService,
    ) { }

  ngOnInit(): void {
    this.getDataSession();
  }

  getDataSession(): void {
    this.socketService.getSessionsLimited().subscribe((session: any) => {
      this.session = session;
      console.log(session)
    });

    this.socketService.recebeDadosQuorum().subscribe((dados: any) => {
      this.dadosQuorum$ = of(dados);
    });

    const quorumStorage = localStorage.getItem('quorum');
    
    if(quorumStorage) {
      this.dadosQuorum$ = of(JSON.parse(quorumStorage));
    }
  }

  openModalQuorum(sessionID: any){
    const initialState = {
      data: {
        modalType: 'QUORUM',
        titleModal: 'QUÓRUM',
        IDsessao: sessionID
      }
    };

    this.bsModalRef = this.modalService.show(
      ModalComponent,
      Object.assign({ initialState }, { class: 'modal-register-item' }),
    );

    this.socketService.sendModalQuorum({
      status: true,
    });
  }

}
