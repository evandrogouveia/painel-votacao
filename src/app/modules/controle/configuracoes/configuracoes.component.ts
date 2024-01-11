import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SocketService } from '../../socket/socket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.scss']
})
export class ConfiguracoesComponent {
  minuto: any;
  timers: any = [];

  addEditConfiguracoesForm: FormGroup | any = this.fb.group({
    ID: [],
    minutos: [''],
    tempoTotal: [''],
    votacaoEmBloco: [''],
    votacaoSecreta: ['']
  });

  constructor(
    private fb: FormBuilder,
    private socketService: SocketService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.getConfiguracoes();
  }

  addTime() {
    if (this.minuto) {
      this.timers.push({value: this.minuto});
      this.addEditConfiguracoesForm.controls.minutos.patchValue(this.timers);
      this.minuto = '';
    } else {
      return;
    }
  }

  removeTime(i: any) {
    this.timers.splice(i, 1);
  }

  getValueRadio() {

  }

  addUpdateConfiguracoes() {
    const ID = this.addEditConfiguracoesForm.value.ID;
    console.log(this.addEditConfiguracoesForm.value)
    if (!ID) {
      this.socketService.newConfiguracoes(this.addEditConfiguracoesForm.value).subscribe(() => {
        this.getConfiguracoes();
        this.toastr.success('Configurações salvas com sucesso!', '');
      }, (err) => {
        this.toastr.error('Ocorreu um erro ao adicionar configuracoes, tente novamente mais tarde', '');
      });
    } else {
      this.socketService.updateConfiguracoes(ID, this.addEditConfiguracoesForm.value).subscribe(() => {
        this.getConfiguracoes();
        this.toastr.success('Configurações atualizadas com sucesso!', '');
      }, (err) => {
        this.toastr.error('Ocorreu um erro ao atualizar configuracoes, tente novamente mais tarde', '');
      });
    }
    
  }

  getConfiguracoes() {
    this.socketService.getAllConfiguracoess().subscribe(res => {
      console.log(res)
      this.addEditConfiguracoesForm.patchValue(res[0]);
      this.timers = res[0].minutos
    });
  }
}
