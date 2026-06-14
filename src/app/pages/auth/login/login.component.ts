import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  carregando = false;
  erro = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando = true;
    this.erro = '';

    this.authService.login(this.email.value, this.senha.value).subscribe({
      next: (res) => {
        const perfil = res.usuario.perfil;
        if (perfil === 'admin') {
          this.router.navigate(['/admin']);
        } else if (perfil === 'funcionario') {
          this.router.navigate(['/funcionario/fila']);
        } else {
          this.router.navigate(['/catalogo']);
        }
      },
      error: () => {
        this.carregando = false;
        this.erro = 'E-mail ou senha inválidos.';
      },
      complete: () => {
        this.carregando = false;
      }
    });
  }

  get email() { return this.form.get('email')!; }
  get senha() { return this.form.get('senha')!; }
}
