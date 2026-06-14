import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MateriaisService } from '../../../../services/materiais.service';
import { Material } from '../../../../models/material.model';

@Component({
  selector: 'app-materiais-list',
  templateUrl: './materiais-list.component.html',
  styleUrls: ['./materiais-list.component.scss']
})
export class MateriaisListComponent implements OnInit {
  materiais: Material[] = [];
  materiaisFiltrados: Material[] = [];
  carregando = true;
  readonly placeholders = Array(5).fill(0);

  filtroNome = '';
  filtroTipo: string | null = null;

  readonly opcoesTipo = [
    { label: 'Todos os tipos', value: null },
    { label: 'Liso',          value: 'liso' },
    { label: 'Sublimação',    value: 'sublimacao' },
  ];

  constructor(
    private materiaisService: MateriaisService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  private carregar(): void {
    this.carregando = true;
    this.materiaisService.listar().subscribe({
      next: (data) => {
        this.materiais = data;
        this.aplicarFiltros();
        this.carregando = false;
      }
    });
  }

  aplicarFiltros(): void {
    this.materiaisFiltrados = this.materiais.filter(m => {
      const matchNome = !this.filtroNome ||
        m.nome.toLowerCase().includes(this.filtroNome.toLowerCase());
      const matchTipo = !this.filtroTipo || m.tipo === this.filtroTipo;
      return matchNome && matchTipo;
    });
  }

  novoMaterial(): void {
    this.router.navigate(['/admin/materiais/novo']);
  }

  editar(id: number): void {
    this.router.navigate(['/admin/materiais', id, 'editar']);
  }

  confirmarRemover(material: Material): void {
    this.confirmationService.confirm({
      message: `Deseja remover "${material.nome}"? Esta ação não pode ser desfeita.`,
      header: 'Confirmar Remoção',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Remover',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.remover(material)
    });
  }

  private remover(material: Material): void {
    this.materiaisService.remover(material.id).subscribe({
      next: () => {
        this.materiais = this.materiais.filter(m => m.id !== material.id);
        this.aplicarFiltros();
        this.messageService.add({
          severity: 'success', summary: 'Removido',
          detail: `"${material.nome}" removido com sucesso.`
        });
      }
    });
  }

  toggleAtivo(material: Material): void {
    this.materiaisService.toggleAtivo(material.id).subscribe({
      next: () => {
        material.ativo = !material.ativo;
        this.messageService.add({
          severity: 'success', summary: 'Atualizado',
          detail: `"${material.nome}" ${material.ativo ? 'ativado' : 'desativado'}.`
        });
      }
    });
  }

  tamanhoCount(material: Material): number {
    return material.tamanhos.filter(t => t.ativo).length;
  }
}
