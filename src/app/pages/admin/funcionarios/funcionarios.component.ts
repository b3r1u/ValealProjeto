import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FuncionariosService } from '../../../services/funcionarios.service';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss']
})
export class FuncionariosComponent implements OnInit {
  funcionarios: Usuario[] = [];
  funcionariosFiltrados: Usuario[] = [];
  carregando = true;
  salvando = false;
  filtroNome = '';

  dialogVisivel = false;
  editando = false;
  funcionarioSelecionado: Usuario | null = null;

  form!: FormGroup;

  readonly placeholders = Array(4).fill(0);

  constructor(
    private fb: FormBuilder,
    private funcionariosService: FuncionariosService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.inicializarForm();
    this.carregar();
  }

  private inicializarForm(): void {
    this.form = this.fb.group({
      nome:  ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  private carregar(): void {
    this.carregando = true;
    this.funcionariosService.listar().subscribe({
      next: (data) => {
        this.funcionarios = data;
        this.aplicarFiltros();
        this.carregando = false;
      }
    });
  }

  aplicarFiltros(): void {
    const termo = this.filtroNome.toLowerCase();
    this.funcionariosFiltrados = this.funcionarios.filter(f =>
      !termo ||
      f.nome.toLowerCase().includes(termo) ||
      f.email.toLowerCase().includes(termo)
    );
  }

  abrirCriacao(): void {
    this.editando = false;
    this.funcionarioSelecionado = null;
    this.form.reset();
    this.form.get('senha')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.get('senha')?.updateValueAndValidity();
    this.dialogVisivel = true;
  }

  abrirEdicao(funcionario: Usuario): void {
    this.editando = true;
    this.funcionarioSelecionado = funcionario;
    this.form.patchValue({ nome: funcionario.nome, email: funcionario.email, senha: '' });
    this.form.get('senha')?.clearValidators();
    this.form.get('senha')?.updateValueAndValidity();
    this.dialogVisivel = true;
  }

  fecharDialog(): void {
    this.dialogVisivel = false;
  }

  onDialogHide(): void {
    this.form.reset();
  }

  salvar(): void {
    if (this.form.invalid) return;
    this.salvando = true;
    const { nome, email, senha } = this.form.value;

    if (this.editando && this.funcionarioSelecionado) {
      this.funcionariosService.editar(this.funcionarioSelecionado.id, { nome, email }).subscribe({
        next: (atualizado) => {
          const idx = this.funcionarios.findIndex(f => f.id === atualizado.id);
          if (idx >= 0) this.funcionarios[idx] = atualizado;
          this.aplicarFiltros();
          this.salvando = false;
          this.fecharDialog();
          this.messageService.add({
            severity: 'success', summary: 'Salvo',
            detail: `"${atualizado.nome}" atualizado com sucesso.`
          });
        },
        error: () => { this.salvando = false; }
      });
    } else {
      this.funcionariosService.criar({ nome, email, senha }).subscribe({
        next: (novo) => {
          this.funcionarios = [...this.funcionarios, novo];
          this.aplicarFiltros();
          this.salvando = false;
          this.fecharDialog();
          this.messageService.add({
            severity: 'success', summary: 'Criado',
            detail: `"${novo.nome}" adicionado com sucesso.`
          });
        },
        error: () => { this.salvando = false; }
      });
    }
  }

  toggleAtivo(funcionario: Usuario): void {
    this.funcionariosService.toggleAtivo(funcionario.id).subscribe({
      next: (atualizado) => {
        funcionario.ativo = atualizado.ativo;
        this.messageService.add({
          severity: 'success', summary: 'Atualizado',
          detail: `"${funcionario.nome}" ${atualizado.ativo ? 'ativado' : 'desativado'}.`
        });
      }
    });
  }

  confirmarRemover(funcionario: Usuario): void {
    this.confirmationService.confirm({
      message: `Deseja remover "${funcionario.nome}"? Esta ação não pode ser desfeita.`,
      header: 'Confirmar Remoção',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Remover',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.remover(funcionario)
    });
  }

  private remover(funcionario: Usuario): void {
    this.funcionariosService.remover(funcionario.id).subscribe({
      next: () => {
        this.funcionarios = this.funcionarios.filter(f => f.id !== funcionario.id);
        this.aplicarFiltros();
        this.messageService.add({
          severity: 'success', summary: 'Removido',
          detail: `"${funcionario.nome}" removido com sucesso.`
        });
      }
    });
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  get tituloDialog(): string {
    return this.editando ? 'Editar Funcionário' : 'Novo Funcionário';
  }

  get labelBotaoSalvar(): string {
    if (this.salvando) return 'Salvando...';
    return this.editando ? 'Salvar' : 'Criar Funcionário';
  }
}
