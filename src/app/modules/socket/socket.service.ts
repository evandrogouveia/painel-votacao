import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
   //private socket = io(environment.SOCKET_URL, {path: '/api/socket.io'});
   private socket = io(environment.API_URL);
   private subjStandby: Subject<any> = new Subject<any>();
   private subjDadosPainel: Subject<any> = new Subject<any>();
   private subjDadosVotacaoBloco: Subject<any> = new Subject<any>();
   private subjDadosInscricao: Subject<any> = new Subject<any>();
   private subjTimer: Subject<any> = new Subject<any>();
   private subjQuorum: Subject<any> = new Subject<any>();
   private subjModalQuorum: Subject<any> = new Subject<any>();
   

  constructor(private http: HttpClient) { 
    this.socket.on('standbyPainel', (dados: any) => {
      this.subjStandby.next(dados);
    });

    this.socket.on('dadosPainel', (dados: any) => {
      this.subjDadosPainel.next(dados);
      localStorage.setItem(`dadosPainel-id-${dados.dados[0]?.ID}`, JSON.stringify(dados));
      localStorage.setItem(`IDmateria`, dados.dados[0]?.ID);
      localStorage.removeItem('dados-votacao-em-bloco');
      localStorage.removeItem('showBtnVotacaoEmBloco');
    });

    this.socket.on('dadosVotacaoBloco', (dados: any) => {
      this.subjDadosVotacaoBloco.next(dados);
      localStorage.setItem(`dados-votacao-em-bloco`, JSON.stringify(dados));
    });

    this.socket.on('removeItemIdStorage', (ID: any) => {
      localStorage.removeItem(`dadosPainel-id-${ID}`);
    });

    this.socket.on('dadosInscricao', (dados: any) => {
      this.subjDadosInscricao.next(dados);
      localStorage.setItem(`inscricao`, JSON.stringify(dados));
      if(dados.status === 'inscricao_encerrada'){
        localStorage.removeItem(`inscricao`);
      }
    });

    this.socket.on('timer', (dados: any) => {
      this.subjTimer.next(dados);
      localStorage.setItem(`timer`, JSON.stringify(dados));
    });

    this.socket.on('quorum', (dados: any) => {
      this.subjQuorum.next(dados);
      localStorage.setItem(`quorum`, JSON.stringify(dados));
    });

    this.socket.on('modalQuorum', (dados: any) => {
      this.subjModalQuorum.next(dados);
      localStorage.setItem(`modalQuorum`, JSON.stringify(dados));
    });
  }

  sendStandby(dados: any) {
    if (dados) {
      this.socket.emit('standbyPainel', dados)
    }
  }

  send(dados: any) {
    if (dados) {
      this.socket.emit('dadosPainel', dados)
    }
  }

  sendVotacaoBloco(dados: any) {
    if (dados) {
      this.socket.emit('dadosVotacaoBloco', dados)
    }
  }

  sendRemoveItemIdStorage(ID: any) {
    if (ID) {
      this.socket.emit('removeItemIdStorage', ID)
    }
  }

  sendInscricao(dados: any) {
    if (dados) {
      this.socket.emit('dadosInscricao', dados)
    }
  }

  sendTimer(dados: any) {
    if (dados) {
      this.socket.emit('timer', dados)
    }
  }

  sendQuorum(dados: any) {
    if (dados) {
      this.socket.emit('quorum', dados)
    }
  }

  sendModalQuorum(dados: any) {
    if (dados) {
      this.socket.emit('modalQuorum', dados)
    }
  }

  recebeDadosStandby(): Observable<any> {
    return this.subjStandby.asObservable();
  }

  recebeDados(): Observable<any> {
    return this.subjDadosPainel.asObservable();
  }

  recebeDadosVotacaoBloco(): Observable<any> {
    return this.subjDadosVotacaoBloco.asObservable();
  }

  recebeDadosInscricao(): Observable<any> {
    return this.subjDadosInscricao.asObservable();
  }

  recebeDadosTimer(): Observable<any> {
    return this.subjTimer.asObservable();
  }

  recebeDadosQuorum(): Observable<any> {
    return this.subjQuorum.asObservable();
  }

  recebeDadosModalQuorum(): Observable<any> {
    return this.subjModalQuorum.asObservable();
  }

  /*** SERVIÇOS DE AGENTES ***/
  getAllAgentes(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/user-all-camara`);
  }

  /*** SERVIÇOS DE CONFIGURAÇÕES ***/
  newConfiguracoes(configuracoes: any): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/new-configuracoes`, configuracoes);
  }
  getAllConfiguracoess(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/all-configuracoes`);
  }
  updateConfiguracoes(configuracoesID: any, configuracoes: any): Observable<any> {
    return this.http.patch<any>(`${environment.API_URL}/update-configuracoes/${configuracoesID}`, configuracoes);
  }
  deleteConfiguracoes(configuracoesID: any): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}/delete-Configuracoes/${configuracoesID}`);
  }

  /*** SERVIÇOS DE MATERIAS E SESSÕES ***/
  getAllMatter(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/all-matter`);
  }
  getSessionsLimited(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/all-session-limited`);
  }


}
