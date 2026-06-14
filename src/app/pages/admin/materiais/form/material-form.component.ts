import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MateriaisService } from '../../../../services/materiais.service';
import { TamanhoMaterial } from '../../../../models/material.model';

@Component({
  selector: 'app-material-form',
  templateUrl: './material-form.component.html',
  styleUrls: ['./material-form.component.scss']
})
export class MaterialFormComponent implements OnInit {
  form!: FormGroup;
  editando = false;
  materialId: number | null = null;
  carregando = false;
  salvando = false;

  readonly opcoesTamanho = [
    { label: 'PP',  value: 'PP'  },
    { label: 'P',   value: 'P'   },
    { label: 'M',   value: 'M'   },
    { label: 'G',   value: 'G'   },
    { label: 'GG',  value: 'GG'  },
    { label: 'XGG', value: 'XGG' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private materiaisService: MateriaisService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome:        ['', Validators.required],
      descricao:   [''],
      sublimacao:  [false],
      estamparia:  [false],
      tamanhos:    this.fb.array([])
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.materialId = +id;
      this.carregarMaterial(+id);
    } else {
      this.adicionarTamanho();
    }
  }

  get tamanhos(): FormArray {
    return this.form.get('tamanhos') as FormArray;
  }

  private criarTamanhoGroup(dados?: Partial<TamanhoMaterial>): FormGroup {
    return this.fb.group({
      tamanho:            [dados?.tamanho           ?? '',   Validators.required],
      preco_unitario:     [dados?.preco_unitario    ?? null, [Validators.required, Validators.min(0.01)]],
      preco_atacado:      [dados?.preco_atacado     ?? null, [Validators.required, Validators.min(0.01)]],
      qtd_minima_atacado: [dados?.qtd_minima_atacado ?? 1,  [Validators.required, Validators.min(1)]],
    });
  }

  adicionarTamanho(): void {
    this.tamanhos.push(this.criarTamanhoGroup());
  }

  removerTamanho(i: number): void {
    this.tamanhos.removeAt(i);
  }

  private carregarMaterial(id: number): void {
    this.carregando = true;
    this.materiaisService.buscarPorId(id).subscribe({
      next: (material) => {
        this.form.patchValue({
          nome:       material.nome,
          descricao:  material.descricao,
          sublimacao: material.permite_sublimacao,
          estamparia: false,
        });

        while (this.tamanhos.length) this.tamanhos.removeAt(0);
        material.tamanhos.forEach(t => this.tamanhos.push(this.criarTamanhoGroup(t)));

        this.carregando = false;
      }
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    const dados = this.form.value;

    const obs = this.editando && this.materialId
      ? this.materiaisService.editar(this.materialId, dados)
      : this.materiaisService.criar(dados);

    obs.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.editando ? 'Atualizado' : 'Criado',
          detail: `Material ${this.editando ? 'atualizado' : 'criado'} com sucesso.`
        });
        setTimeout(() => this.router.navigate(['/admin/materiais']), 1200);
      },
      error: () => {
        this.salvando = false;
        this.messageService.add({
          severity: 'error', summary: 'Erro',
          detail: 'Não foi possível salvar o material.'
        });
      }
    });
  }

  selecionarTecnica(tecnica: 'sublimacao' | 'estamparia'): void {
    const ativa = this.form.get(tecnica)?.value;
    this.form.patchValue({ sublimacao: false, estamparia: false });
    if (!ativa) {
      this.form.get(tecnica)?.setValue(true);
    }
  }

  limparCampos(): void {
    this.form.patchValue({ nome: '', descricao: '', sublimacao: false, estamparia: false });
    while (this.tamanhos.length) this.tamanhos.removeAt(0);
    this.adicionarTamanho();
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

  precoDisplay(index: number, campo: string): string {
    const valor: number | null = (this.tamanhos.at(index) as FormGroup).get(campo)?.value;
    if (!valor || valor <= 0) return '';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  onPrecoInput(event: Event, index: number, campo: string): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '');
    const centavos = parseInt(digits || '0', 10);
    const valor = centavos / 100;
    const grupo = this.tamanhos.at(index) as FormGroup;
    grupo.get(campo)?.setValue(valor > 0 ? valor : null);
    grupo.get(campo)?.markAsTouched();
    input.value = valor > 0
      ? valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : '';
  }

  cancelar(): void {
    this.router.navigate(['/admin/materiais']);
  }
}
