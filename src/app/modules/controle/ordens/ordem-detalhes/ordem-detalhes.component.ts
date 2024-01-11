import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { SocketService } from 'src/app/modules/socket/socket.service';

@Component({
  selector: 'app-ordem-detalhes',
  templateUrl: './ordem-detalhes.component.html',
  styleUrls: ['./ordem-detalhes.component.scss']
})
export class OrdemDetalhesComponent implements OnInit {
  session: any = [];
  materias: any = [];

  leituraIniciada: any = [false];

  btnParar: any = [false];
  btnEncerrar: any = [false];
  exibeResultados: any = [false];

  qtdSim: any = [0];
  qtdAbs: any = [0];
  qtdNao: any = [0];

  agentes: any = [];

  votacaoEmBloco: boolean = false;
  votacaoSecreta: boolean = false;
  showBtnVotacaoEmBloco: boolean = false;
  changeBtnVotacaoEmBloco: any = [false];

  arrayBlocosMaterias: any = [];

  btnIniciarVotacaoEmBloco: boolean = false;
  btnPararVotacaoEmBloco: boolean = false;
  btnEncerrarVotacaoEmBloco: boolean = false;

  dados$: Observable<any> = of();


  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
  ) { }

  ngOnInit(): void {
    this.getDetalhesSession();
    this.recebeDados();
    this.getConfiguracoes();
    this.recebeDadosVotacaoBloco();
    const agentsStorage: any = localStorage.getItem('agents');
    this.agentes = JSON.parse(agentsStorage);
  }

  getConfiguracoes() {
    this.socketService.getAllConfiguracoess().subscribe(res => {
      res[0].votacaoEmBloco === 1 ? this.votacaoEmBloco = true : this.votacaoEmBloco = false;
      res[0].votacaoSecreta === 1 ? this.votacaoSecreta = true : this.votacaoSecreta = false;
    });
  }

  getDetalhesSession(): void {
    const getSessionID: any = this.route.snapshot.paramMap.get('id');
    forkJoin([
      this.socketService.getAllMatter(),
      this.socketService.getSessionsLimited(),
    ]).subscribe((res: any) => {
      console.log(res)
      this.materias = res[0].filter((m: any) => m.IDsessao === parseInt(getSessionID));
      this.session = res[1].filter((s: any) => s.ID === parseInt(getSessionID));

      this.materias.map((m: any) => {

        m.agentVotation = this.agentes.filter((a: any) => a.confirma === 'Presente')
        const dadosStorage: any = localStorage.getItem(`dadosPainel-id-${m.ID}`);

        switch (JSON.parse(dadosStorage)?.status) {
          case 'leitura':
            this.leituraIniciada[m.ID] = true;
            break;
          case 'votacao':
          case 'votacao_secreta':
            this.btnEncerrar[m.ID] = true;
            this.btnParar[m.ID] = true;
            this.exibeResultados[m.ID] = true;

            this.qtdSim[m.ID] = JSON.parse(dadosStorage).dados[0]?.agentVotation.filter((v: any) => v.status === 'sim').length;
            this.qtdAbs[m.ID] = JSON.parse(dadosStorage).dados[0]?.agentVotation.filter((v: any) => v.status === 'abs').length;
            this.qtdNao[m.ID] = JSON.parse(dadosStorage).dados[0]?.agentVotation.filter((v: any) => v.status === 'nao').length;
            break;
          case 'votacao_parada':
            this.btnEncerrar[m.ID] = true;
            this.btnParar[m.ID] = false;
            this.exibeResultados[m.ID] = true;
            this.qtdSim[m.ID] = JSON.parse(dadosStorage).dados[0]?.agentVotation.filter((v: any) => v.status === 'sim').length;
            this.qtdAbs[m.ID] = JSON.parse(dadosStorage).dados[0]?.agentVotation.filter((v: any) => v.status === 'abs').length;
            this.qtdNao[m.ID] = JSON.parse(dadosStorage).dados[0]?.agentVotation.filter((v: any) => v.status === 'nao').length;
            break;
          case 'votacao_encerrada':
            this.btnEncerrar[m.ID] = false;
            this.btnParar[m.ID] = false;
            this.exibeResultados[m.ID] = true;
            this.qtdSim[m.ID] = JSON.parse(dadosStorage).dados[0]?.agentVotation.filter((v: any) => v.status === 'sim').length;
            this.qtdAbs[m.ID] = JSON.parse(dadosStorage).dados[0]?.agentVotation.filter((v: any) => v.status === 'abs').length;
            this.qtdNao[m.ID] = JSON.parse(dadosStorage).dados[0]?.agentVotation.filter((v: any) => v.status === 'nao').length;
            break;
        }
      });
    });
  }

  iniciarLeituraMateria(IDmateria: any) {
    this.leituraIniciada[IDmateria] = !this.leituraIniciada[IDmateria];
    if (this.leituraIniciada[IDmateria]) {
      this.socketService.send({
        status: 'leitura',
        dados: this.materias.filter((m: any)=> m.ID === IDmateria)
      });
    } else {
      this.socketService.send({
        status: 'leitura_encerrada',
        dados: this.materias.filter((m: any) => m.ID === IDmateria)
      });
    }
  }

  iniciarVotacaoMateria(IDmateria: any) {
    this.btnEncerrar[IDmateria] = true;
    this.btnParar[IDmateria] = true;
    this.exibeResultados[IDmateria] = true;
    this.socketService.send({
      status: 'votacao',
      votacaoEmBloco: false,
      dados: this.materias.filter((m: any) => m.ID === IDmateria)
    });
  }

  votacaoSecretaMateria(IDmateria: any) {
    this.btnEncerrar[IDmateria] = true;
    this.btnParar[IDmateria] = true;
    this.exibeResultados[IDmateria] = true;
    this.socketService.send({
      status: 'votacao_secreta',
      votacaoEmBloco: false,
      dados: this.materias.filter((m: any) => m.ID === IDmateria)
    });
  }

  stopVotacao(IDmateria: any) {
    const dadosStorage: any = localStorage.getItem(`dadosPainel-id-${IDmateria}`);
    this.btnEncerrar[IDmateria] = true;
    this.btnParar[IDmateria] = false;
    this.exibeResultados[IDmateria] = true;
    this.socketService.send({
      status: 'votacao_parada',
      votacaoEmBloco: false,
      dados: JSON.parse(dadosStorage).dados
    });
  }

  encerrarVotacaoMateria(IDmateria: any) {
    const dadosStorage: any = localStorage.getItem(`dadosPainel-id-${IDmateria}`);
    this.btnEncerrar[IDmateria] = false;
    this.btnParar[IDmateria] = false;
    this.exibeResultados[IDmateria] = true;
    this.socketService.send({
      status: 'votacao_encerrada',
      votacaoEmBloco: false,
      dados: JSON.parse(dadosStorage).dados
    });

  }

  showVotacaoEmBloco() {
    this.showBtnVotacaoEmBloco = true;
  }

  changeVotacaoEmBloco(IDmateria: any) {
    const IDMateria: any = IDmateria;
    this.changeBtnVotacaoEmBloco[IDmateria] = !this.changeBtnVotacaoEmBloco[IDmateria]

    this.materias.map((m: any) => {
      const materia: any = m;
      if (materia.ID === IDmateria && this.changeBtnVotacaoEmBloco[IDMateria]) {
        this.arrayBlocosMaterias.push(m);
      }

      if (materia.ID === IDMateria && this.changeBtnVotacaoEmBloco[IDMateria] === false) {
        const index: any = this.arrayBlocosMaterias.indexOf(IDMateria);
        this.arrayBlocosMaterias.splice(index, 1);
      }
    });

    this.socketService.sendRemoveItemIdStorage(IDmateria);
  }

  iniciarVotacaoEmBloco() {
    this.btnIniciarVotacaoEmBloco = true;
    this.btnPararVotacaoEmBloco = true;
    this.btnEncerrarVotacaoEmBloco = true;

    this.socketService.sendVotacaoBloco({
      status: 'votacao',
      votacaoEmBloco: true,
      dados: this.arrayBlocosMaterias
    });
    localStorage.setItem('showBtnVotacaoEmBloco', JSON.stringify(true));
  }

  stopVotacaoEmBloco() {
    const votacaoEmBlocoStorage: any = localStorage.getItem('dados-votacao-em-bloco');
    this.btnPararVotacaoEmBloco = false;
    this.socketService.sendVotacaoBloco({
      status: 'votacao_parada',
      votacaoEmBloco: true,
      dados: JSON.parse(votacaoEmBlocoStorage).dados
    });
  }

  encerrarVotacaoEmBloco() {
    this.arrayBlocosMaterias = [];
    this.showBtnVotacaoEmBloco = false;
    this.changeBtnVotacaoEmBloco = [false];
    this.btnEncerrarVotacaoEmBloco = false;
    this.btnIniciarVotacaoEmBloco = false;

    this.socketService.sendVotacaoBloco({
      status: 'votacao_encerrada',
      votacaoEmBloco: false,
      dados: []
    });
    localStorage.setItem('showBtnVotacaoEmBloco', JSON.stringify(false));
  }

  recebeDados() {
    this.socketService.recebeDados().subscribe(data => {
      if (data) {
        this.dados$ = of(data);
        this.qtdSim[data.dados[0]?.ID] = data.dados[0]?.agentVotation.filter((v: any) => v.status === 'sim').length;
        this.qtdAbs[data.dados[0]?.ID] = data.dados[0]?.agentVotation.filter((v: any) => v.status === 'abs').length;
        this.qtdNao[data.dados[0]?.ID] = data.dados[0]?.agentVotation.filter((v: any) => v.status === 'nao').length;
      }
    });
  }

  recebeDadosVotacaoBloco() {
    this.socketService.recebeDados().subscribe(data => {
      this.dados$ = of(data);
    });

    const votacaoEmBlocoStorage = localStorage.getItem('dados-votacao-em-bloco');
    if (votacaoEmBlocoStorage) {
    
        this.dados$ = of(JSON.parse(votacaoEmBlocoStorage));
     
      if (JSON.parse(votacaoEmBlocoStorage).votacaoEmBloco === true) {
        this.showBtnVotacaoEmBloco = true;
        this.btnEncerrarVotacaoEmBloco = true;
      } else {
        this.showBtnVotacaoEmBloco = false;
        this.btnEncerrarVotacaoEmBloco = false;
      }
    }
  }

}
