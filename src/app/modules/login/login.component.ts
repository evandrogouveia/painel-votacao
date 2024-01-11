import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoginService } from './services/login.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  show = false;
  type = 'password';

  showLoginForm = true;
  loading = false;
  msgErro = '';

  loginForm: FormGroup | any = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });

  registerForm: FormGroup | any = this.fb.group({
    id: [''],
    agentID: [''],
    nome: [''],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    permissao: ['']
  });

  constructor(
    private fb: UntypedFormBuilder,
    private loginService: LoginService
    ) { }

  ngOnInit(): void {
  }

  showHidPassword(): void {
    this.show = !this.show;
    if (this.show) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  cadastro(): void {
    this.loading = true;
    this.registerForm.get('agentID').patchValue(903);
    this.registerForm.get('nome').patchValue('admin');
    this.registerForm.get('email').patchValue('admin@camaraindependencia.ce.gov.br');
    this.registerForm.get('senha').patchValue('CE@admin2024');
    this.registerForm.get('permissao').patchValue('admin');

    if (this.registerForm.valid) {
      this.msgErro = '';
      this.loginService.register(this.registerForm.value).subscribe((res) => {
        if (res) { this.loading = false; }
       },
       (err) => {
         this.loading = false;
         this.loginRegisterError(err.message);
       });
    } else {
      this.loading = false;
    }
  }

  submitLogin(): void {
    this.loading = true;
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).subscribe(() => {
        this.loading = false;
      },
        (err) => {
          this.loading = false;
          this.loginRegisterError(err.message);
        });
    } else {
      this.loading = false;
    }
  }

  private loginRegisterError(err: any): void {
    this.msgErro = err;
  }
}
