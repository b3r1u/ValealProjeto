import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MateriaisListComponent } from './materiais/list/materiais-list.component';
import { MaterialFormComponent } from './materiais/form/material-form.component';
import { PedidosAdminComponent } from './pedidos/list/pedidos-admin.component';
import { PedidoDetalheComponent } from './pedidos/detalhe/pedido-detalhe.component';
import { FuncionariosComponent } from './funcionarios/funcionarios.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '',                     component: DashboardComponent },
      { path: 'materiais',            component: MateriaisListComponent },
      { path: 'materiais/novo',       component: MaterialFormComponent },
      { path: 'materiais/:id/editar', component: MaterialFormComponent },
      { path: 'pedidos',              component: PedidosAdminComponent },
      { path: 'pedidos/:id',          component: PedidoDetalheComponent },
      { path: 'funcionarios',         component: FuncionariosComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
