import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { SocketService } from '../../socket/socket.service';
import { GlobalTimerService } from '../../global-timer/services/global-timer.service';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-expediente',
  templateUrl: './expediente.component.html',
  styleUrls: ['./expediente.component.scss']
})
export class ExpedienteComponent {
  initTimeVereadores = false;
  initTimeBancadas = false;
  inscricaoParada = false;
  initTimeButtons = false;

  dados$: Observable<any> = of();

  valueButtonClicked: any;
  pauseTime: any;

  minutos$: Observable<any> = of();
  segundos$: Observable<any> = of();
  agentIDAlreadyTalked: any = [];
  timerOptions: any = [];
  bsModalRef?: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private socketService: SocketService,
    private globalTimerService: GlobalTimerService
  ) { }

  ngOnInit(): void {
    this.recebeDadosInscricao();
    this.getTimerOptions();
  }

  InscreverTodos() {
    this.socketService.getAllAgentes().subscribe(agents => {
      console.log(agents)
      const inscricaoStorage = localStorage.getItem('inscricao');
      this.inscricaoParada = true;
      if (inscricaoStorage) {
        this.socketService.sendInscricao({
          status: 'inscricao_parada',
          timer: false,
          timerAgent: false,
          agentsIdAlreadyTalked: JSON.parse(inscricaoStorage).agentsIdAlreadyTalked,
          agentIdCurrentTime: JSON.parse(inscricaoStorage)?.agentIdCurrentTime,
          startNegative: JSON.parse(inscricaoStorage)?.startNegative,
          agents: agents
        });
      } else {
        this.socketService.sendInscricao({
          status: 'inscricao_parada',
          timer: false,
          timerAgent: false,
          agentsIdAlreadyTalked: [],
          agentIdCurrentTime: [],
          startNegative: false,
          agents: agents
        });
      }
    });
  }

  getTimerOptions() {
    this.socketService.getAllConfiguracoess().subscribe(res => {
      this.timerOptions = res;
    });
  }

  startStopTimeVereadores() {
    this.initTimeVereadores = !this.initTimeVereadores;
    const inscricaoStorage: any = localStorage.getItem('inscricao');
    if (this.initTimeVereadores) {
      this.socketService.sendInscricao({
        status: 'inscricao',
        timer: true,
        timerAgent: false,
        agentsIdAlreadyTalked: [],
        agentIdCurrentTime: null,
        startNegative: false,
        agents: [],
      });
      //this.globalTimerService.startTimePlus();
    } else {
      this.inscricaoParada = true;
      this.socketService.sendInscricao({
        status: 'inscricao_parada',
        timer: false,
        timerAgent: false,
        agentsIdAlreadyTalked: [],
        agentIdCurrentTime: null,
        startNegative: false,
        agents: JSON.parse(inscricaoStorage).agents
      });
      this.globalTimerService.resetTime();
    }
  }

  initTime(value: any, agentID: any) {
    this.valueButtonClicked = value;
    this.initTimeButtons = true;
    //value === 0 ? this.globalTimerService.startTimePlus() : this.globalTimerService.startTimeMinus(value);
    localStorage.setItem('botaoClicado', this.valueButtonClicked);
    const inscricaoStorage: any = localStorage.getItem('inscricao');

    if (this.agentIDAlreadyTalked.indexOf(agentID) == -1) {
      this.agentIDAlreadyTalked.push(agentID);
    }

    this.socketService.sendInscricao({
      status: 'inscricao_parada',
      timer: false,
      timerAgent: true,
      agentIdCurrentTime: agentID,
      agentsIdAlreadyTalked: this.agentIDAlreadyTalked,
      startNegative: false,
      agents: JSON.parse(inscricaoStorage).agents
    });

    this.socketService.sendTimer({
      status: 'start',
      minutes: value
    });
  }

  incrementTime(value: any) {
    this.socketService.sendTimer({
      status: 'increment',
      minutes: value
    });
  }

  pause() {
    this.pauseTime = !this.pauseTime;
    if (this.pauseTime) {
      this.socketService.sendTimer({
        status: 'pause',
        minutes: null
      });
    } else {
      this.socketService.sendTimer({
        status: 'resume',
        minutes: null
      });
    }
    
  }

  resetTime() {
    this.valueButtonClicked = null;
    this.initTimeButtons = false;
    const inscricaoStorage: any = localStorage.getItem('inscricao');

    this.socketService.sendInscricao({
      status: 'inscricao_parada',
      timer: false,
      timerAgent: false,
      agentsIdAlreadyTalked: JSON.parse(inscricaoStorage).agentsIdAlreadyTalked,
      agentIdCurrentTime: null,
      startNegative: false,
      agents: JSON.parse(inscricaoStorage).agents
    });
   
    this.socketService.sendTimer({
      status: 'reset',
      minutes: null
    });
  }

  removeAgent(agentID: any) {
    const inscricaoStorage: any = localStorage.getItem('inscricao');
    const agent = JSON.parse(inscricaoStorage).agents.filter((a: any) => a.ID !== agentID)

    this.socketService.sendInscricao({
      status: JSON.parse(inscricaoStorage).status,
      timer: true,
      timerAgent: false,
      agentsIdAlreadyTalked: JSON.parse(inscricaoStorage).agentsIdAlreadyTalked,
      agentIdCurrentTime: null,
      startNegative: false,
      agents: agent
    });
  }

  encerrar() {
    this.inscricaoParada = false;
    this.socketService.sendInscricao({
      status: 'inscricao_encerrada',
      timer: false,
      timerAgent: false,
      agentsIdAlreadyTalked: [],
      agentIdCurrentTime: null,
      startNegative: false,
      agents: []
    });
    this.socketService.sendStandby(true);
    this.globalTimerService.resetTime();
    localStorage.removeItem('agentIDAlreadyTalked');
  }

  /*startStopTimeBancadas() {
    this.initTimeBancadas = !this.initTimeBancadas;
    if (this.initTimeBancadas) { }
  }*/

  recebeDadosInscricao() {
    const inscricaoStorage: any = localStorage.getItem('inscricao');
    const botaoClicadoStorage: any = localStorage.getItem('botaoClicado');
    if (botaoClicadoStorage) {
      this.valueButtonClicked = JSON.parse(botaoClicadoStorage);
      this.initTimeButtons = true;
    }


    if (JSON.parse(inscricaoStorage)?.status === 'inscricao') {
      this.initTimeVereadores = true;
      this.dados$ = of(JSON.parse(inscricaoStorage));
    }

    if (JSON.parse(inscricaoStorage)?.status === 'inscricao_parada') {
      this.initTimeVereadores = false;
      this.inscricaoParada = true;
      this.dados$ = of(JSON.parse(inscricaoStorage));
    }

    this.socketService.recebeDadosInscricao().subscribe(dados => {
      this.dados$ = of(dados);
    });
  }

  openModalAddConvidado() {
    const initialState = {
      data: {
        modalType: 'ADD_CONVIDADO',
        titleModal: 'Adicionar Convidado',
      }
    };

    this.bsModalRef = this.modalService.show(
      ModalComponent,
      Object.assign({ initialState }, { class: 'modal-register-item' }),
    );
  }
}
