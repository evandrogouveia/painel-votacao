import { Component } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { SocketService } from '../socket/socket.service';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.scss']
})
export class PainelComponent {
  materias$: Observable<any>  = of(null);
  currentDate = new Date().toISOString();
  currentTime: string | any;
  dadosCamara: any = [];
  dadosHeader: any = [];
  dados$: Observable<any> = of(null);
  statusModal$: Observable<any> = of(null);
  type$: Observable<any> = of();

  qtdSim = 0;
  qtdAbs = 0;
  qtdNao = 0;

  startNegative = false;
  agentIDAlreadyTalked = [];
  standbyPainel = true;

  constructor(
    private socketService: SocketService,
  ) {
    this.displayClock();
  }

  ngOnInit(): void {
    this.getDadosTimer();
    this.getDadosGerais();
    this.recebeDados();
    this.recebeDadosInscricao();
    this.recebeDadosQuorum();
    this.recebeDadosVotacaoBloco();
  }

  displayClock() {
    setInterval(() => {
      this.currentTime = new Date().toString().split(' ')[4];
    }, 1);
  }

  getDadosTimer() {
    this.socketService.recebeDadosTimer().subscribe(res => {
      if (res) {
        this.type$ = of(res?.type);
      }
    });
  }

  getDadosGerais() {
    /*forkJoin([
      this.materiasService.getAllMatter(),
      this.materiasService.getAllSession(),
      this.informacoesMunicipaisService.getCamara(),
      this.editThemeService.getHeader()
    ]).subscribe(res => {
      //this.materias = res[0].filter(m => m.IDsessao ===  221);
      this.dadosCamara = res[2];
      this.dadosHeader = res[3];
    });*/
  }

  recebeDados() {
    const IDmateriaStorage = localStorage.getItem('IDmateria');

    if (IDmateriaStorage !== null) {
      const dadosStorage: any = localStorage.getItem(`dadosPainel-id-${JSON.parse(IDmateriaStorage)}`);

      if (JSON.parse(dadosStorage).status === 'leitura') {
        this.socketService.send({
          status: 'leitura',
          dados: JSON.parse(dadosStorage).dados
        });
      } else if (JSON.parse(dadosStorage).status === 'votacao_parada') {
        this.socketService.send({
          status: 'votacao_parada',
          votacaoEmBloco: JSON.parse(dadosStorage).votacaoEmBloco,
          dados: JSON.parse(dadosStorage).dados
        });
      } else if (JSON.parse(dadosStorage).status === 'votacao') {
        this.socketService.send({
          status: 'votacao',
          votacaoEmBloco: JSON.parse(dadosStorage).votacaoEmBloco,
          dados: JSON.parse(dadosStorage).dados
        });
      } else if (JSON.parse(dadosStorage).status === 'votacao_secreta') {
        this.socketService.send({
          status: 'votacao_secreta',
          votacaoEmBloco: JSON.parse(dadosStorage).votacaoEmBloco,
          dados: JSON.parse(dadosStorage).dados
        });
      } else if (JSON.parse(dadosStorage).status === 'votacao_encerrada') {
        this.socketService.send({
          status: 'votacao_encerrada',
          votacaoEmBloco: JSON.parse(dadosStorage).votacaoEmBloco,
          dados: JSON.parse(dadosStorage).dados
        });
      }
    }

    this.socketService.recebeDados().subscribe(data => {
      if (data) {
        data.dados[0]?.agentVotation.sort((a: any, b: any) => {
          if (a.cargo.localeCompare('Presidente')) {
            return 1
          } else {
            return -1
          }
        });
        this.dados$ = of(data)
        this.qtdSim = data.dados[0]?.agentVotation.filter((v: any) => v.status === 'sim').length;
        this.qtdAbs = data.dados[0]?.agentVotation.filter((v: any) => v.status === 'abs').length;
        this.qtdNao = data.dados[0]?.agentVotation.filter((v: any) => v.status === 'nao').length;
      }
    });
  }

  recebeDadosVotacaoBloco() {
    this.socketService.recebeDadosVotacaoBloco().subscribe(data => {
      this.dados$ = of(data)
      this.qtdSim = data.dados[0]?.agentVotation.filter((v: any) => v.status === 'sim').length;
      this.qtdAbs = data.dados[0]?.agentVotation.filter((v: any) => v.status === 'abs').length;
      this.qtdNao = data.dados[0]?.agentVotation.filter((v: any) => v.status === 'nao').length;
    });

    const votacaoEmBlocoStorage = localStorage.getItem('dados-votacao-em-bloco');
    if (votacaoEmBlocoStorage) {
      setTimeout(() => {
        this.dados$ = of(JSON.parse(votacaoEmBlocoStorage));
        this.qtdSim = JSON.parse(votacaoEmBlocoStorage).dados[0]?.agentVotation.filter((v: any) => v.status === 'sim').length;
        this.qtdAbs = JSON.parse(votacaoEmBlocoStorage).dados[0]?.agentVotation.filter((v: any) => v.status === 'abs').length;
        this.qtdNao = JSON.parse(votacaoEmBlocoStorage).dados[0]?.agentVotation.filter((v: any) => v.status === 'nao').length;
      }, 1500);
    }
  }

  recebeDadosInscricao() {
    this.socketService.recebeDadosInscricao().subscribe((data: any) => {
      console.log(data)
      this.dados$ = of(data)
    });

    this.socketService.recebeDadosStandby().subscribe(status => {
      this.standbyPainel = status;
    })
    
    setTimeout(() => {
      const inscricaoStorage = localStorage.getItem('inscricao');

      if (inscricaoStorage) {
        this.dados$ = of(JSON.parse(inscricaoStorage))
      }
    }, 1500);

  }

  recebeDadosQuorum() {
    this.socketService.recebeDadosQuorum().subscribe((data: any) => {
      this.dados$ = of(data)
    });

    this.socketService.recebeDadosModalQuorum().subscribe((data: any) => {
      this.statusModal$ = of(data);
    });

    const quorumStorage = localStorage.getItem('quorum');
    const modalQuorumStorage = localStorage.getItem('modalQuorum');

    setTimeout(() => {
      if (quorumStorage) {
        this.dados$ = of(JSON.parse(quorumStorage));
      }
      if (modalQuorumStorage) {
        this.statusModal$ = of(JSON.parse(modalQuorumStorage));
      }
    }, 1500)


  }
}
