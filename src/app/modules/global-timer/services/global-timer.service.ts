import { Injectable } from '@angular/core';
import { SocketService } from '../../socket/socket.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalTimerService {

  totalSeconds = 0;
  segundos: any;

  initTimerPlus: any;
  initTimerMinus: any;

  pauseTimer = false;

  contador: any;

  constructor(private socketService: SocketService) {
    this.getTimeStorage();
  }

  getTimeStorage(incrementValue?: any) {
    const timeStorage: any = localStorage.getItem('timer');
   
    if (timeStorage !== null) {
      let time = JSON.parse(timeStorage);
      if (incrementValue) {
        clearInterval(this.contador);
        let sumMinutes = (parseInt(time.minutos) + incrementValue);
        this.contagemStorage(this.pad(sumMinutes), time.segundos);
      } else {
        this.contagemStorage(time.minutos, time.segundos);
      }
    }
  }


  iniciarContagem(minutos: any) {
    this.resetTime();

    this.segundos = minutos * 60;
  
    let contagemRegressiva = true;
  
    this.contador = setInterval(() => {
      const minutosRestantes = Math.floor(this.segundos / 60);
      const segundosRestantes = this.segundos % 60;

      if (contagemRegressiva) {
        this.socketService.sendTimer({
          minutos: this.pad(minutosRestantes), segundos: this.pad(segundosRestantes), type: 'minus'
        });
      } else {
        this.socketService.sendTimer({
          minutos: this.pad(minutosRestantes), segundos: this.pad(segundosRestantes), type: 'plus'
        });
      }

      if (this.segundos === 0) {
        if (contagemRegressiva) {
          contagemRegressiva = false;
        } else {
          clearInterval(this.contador);
        }
      }

      this.segundos += contagemRegressiva ? -1 : 1;

    }, 1000);
  }

  contagemStorage(minutos: any, segundos?: any) {
   
    this.segundos = segundos;
  
    let contagemRegressiva = true;
  
    this.contador = setInterval(() => {
  
      const segundosRestantes = this.segundos % 60;

      if (contagemRegressiva) {
        this.socketService.sendTimer({
          minutos: minutos, segundos: this.pad(segundosRestantes), type: 'minus'
        });
      } else {
        this.socketService.sendTimer({
          minutos: minutos, segundos: this.pad(segundosRestantes), type: 'plus'
        });
      }

      if (this.segundos === 0) {
        if (contagemRegressiva) {
          contagemRegressiva = false;
        } else {
          clearInterval(this.contador);
        }
      }

      this.segundos += contagemRegressiva ? -1 : 1;

    }, 1000);

  }

  pauseTime(valueButton: any): Observable<any> {
    this.pauseTimer = !this.pauseTimer;

    if (this.pauseTimer) {
      clearInterval(this.contador);
    } else {
      this.getTimeStorage();
    }
  
    return of(this.pauseTimer);
  }

  resetTime() {
    clearInterval(this.contador);
    localStorage.removeItem('timer');
    localStorage.removeItem('botaoClicado');
  }

  pad(val: any): any {
    return val > 9 ? val : '0' + val
  }
  
}
