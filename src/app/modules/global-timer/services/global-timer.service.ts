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
  }

  getTimeStorage(incrementValue?: any) {
    const timeStorage: any = localStorage.getItem('timer');
   
    if (timeStorage !== null) {
      let time = JSON.parse(timeStorage);
      if (incrementValue) {
        clearInterval(this.contador);
        let sumMinutes = (parseInt(time.minutos) + incrementValue);

      } 
    }
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
