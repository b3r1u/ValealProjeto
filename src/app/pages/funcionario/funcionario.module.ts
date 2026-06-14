import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FuncionarioRoutingModule } from './funcionario-routing.module';
import { FilaChatsComponent } from './fila/fila-chats.component';
import { ChatDesignerComponent } from './chat/chat-designer.component';

@NgModule({
  declarations: [FilaChatsComponent, ChatDesignerComponent],
  imports: [SharedModule, FuncionarioRoutingModule]
})
export class FuncionarioModule {}
