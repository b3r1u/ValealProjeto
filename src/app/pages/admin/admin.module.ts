import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';

import { AdminLayoutComponent } from './layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MateriaisListComponent } from './materiais/list/materiais-list.component';
import { MaterialFormComponent } from './materiais/form/material-form.component';
import { PedidosAdminComponent } from './pedidos/list/pedidos-admin.component';
import { PedidoDetalheComponent } from './pedidos/detalhe/pedido-detalhe.component';
import { FuncionariosComponent } from './funcionarios/funcionarios.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardComponent,
    MateriaisListComponent,
    MaterialFormComponent,
    PedidosAdminComponent,
    PedidoDetalheComponent,
    FuncionariosComponent,
  ],
  imports: [SharedModule, AdminRoutingModule, TooltipModule, SkeletonModule, TagModule]
})
export class AdminModule {}
