import { AfterViewInit, Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SocketService } from '../socket/socket.service';

@Component({
  selector: 'app-global-timer',
  templateUrl: './global-timer.component.html',
  styleUrls: ['./global-timer.component.scss']
})
export class GlobalTimerComponent implements AfterViewInit {
  startNegative$: Observable<any> = of();
  minutos$: Observable<any> = of();
  segundos$: Observable<any> = of();
  dados$: Observable<any> = of();
  type$: Observable<any> = of();

  constructor(
    private socketService: SocketService
  ) { }

  ngAfterViewInit(): void {
    this.getDadosService();
  }

  getDadosService() {
    this.socketService.recebeDadosTimer().subscribe(res => {
      if (res) {
        console.log(res)
        this.type$ = of(res?.type);
        this.minutos$ = of(res?.minutos);
        this.segundos$ = of(res?.segundos);
      }
    });

    const inscricaoStorage = localStorage.getItem('inscricao');
    if (inscricaoStorage){
      this.dados$ = of(JSON.parse(inscricaoStorage));
    }
  }
}
