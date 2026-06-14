import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MateriaisListComponent } from './materiais/list/materiais-list.component';
import { MaterialFormComponent } from './materiais/form/material-form.component';
import { PedidosAdminComponent } from './pedidos/list/pedidos-admin.component';
import { PedidoDetalheComponent } from './pedidos/detalhe/pedido-detalhe.component';
import { FuncionariosComponent } from './funcionarios/funcionarios.component';

@NgModule({
  declarations: [
    DashboardComponent,
    MateriaisListComponent,
    MaterialFormComponent,
    PedidosAdminComponent,
    PedidoDetalheComponent,
    FuncionariosComponent
  ],
  imports: [SharedModule, AdminRoutingModule]
})
export class AdminModule {}
