import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { Textarea } from 'primeng/textarea';
import { PaginatorModule } from 'primeng/paginator';
import { Dialog } from 'primeng/dialog';

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
  imports: [
    SharedModule, AdminRoutingModule,
    TooltipModule, SkeletonModule, TagModule,
    TableModule, ButtonModule, InputTextModule, DropdownModule,
    ConfirmDialogModule, ToastModule,
    InputNumberModule, CheckboxModule, Textarea, PaginatorModule, Dialog,
  ],
  providers: [MessageService, ConfirmationService]
})
export class AdminModule {}
