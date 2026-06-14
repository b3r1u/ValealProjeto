import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilaChatsComponent } from './fila/fila-chats.component';
import { ChatDesignerComponent } from './chat/chat-designer.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: 'fila',           component: FilaChatsComponent,   canActivate: [AuthGuard], data: { perfis: ['funcionario'] } },
  { path: 'chat/:sessaoId', component: ChatDesignerComponent, canActivate: [AuthGuard], data: { perfis: ['funcionario'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuncionarioRoutingModule {}
