import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ClienteRoutingModule } from './cliente-routing.module';
import { HomeComponent } from './home/home.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { ProdutoComponent } from './produto/produto.component';
import { CarrinhoComponent } from './carrinho/carrinho.component';
import { ArteComponent } from './arte/arte.component';
import { ChatClienteComponent } from './chat/chat-cliente.component';
import { ConfirmacaoComponent } from './confirmacao/confirmacao.component';

@NgModule({
  declarations: [
    HomeComponent,
    CatalogoComponent,
    ProdutoComponent,
    CarrinhoComponent,
    ArteComponent,
    ChatClienteComponent,
    ConfirmacaoComponent
  ],
  imports: [SharedModule, ClienteRoutingModule]
})
export class ClienteModule {}
