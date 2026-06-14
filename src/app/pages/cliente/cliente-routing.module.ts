import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { ProdutoComponent } from './produto/produto.component';
import { CarrinhoComponent } from './carrinho/carrinho.component';
import { ArteComponent } from './arte/arte.component';
import { ChatClienteComponent } from './chat/chat-cliente.component';
import { ConfirmacaoComponent } from './confirmacao/confirmacao.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '',                   component: HomeComponent },
  { path: 'catalogo',           component: CatalogoComponent },
  { path: 'produto/:id',        component: ProdutoComponent },
  { path: 'carrinho',           component: CarrinhoComponent,     canActivate: [AuthGuard], data: { perfis: ['cliente'] } },
  { path: 'pedido/arte',        component: ArteComponent,         canActivate: [AuthGuard], data: { perfis: ['cliente'] } },
  { path: 'pedido/chat',        component: ChatClienteComponent,  canActivate: [AuthGuard], data: { perfis: ['cliente'] } },
  { path: 'pedido/confirmacao', component: ConfirmacaoComponent,  canActivate: [AuthGuard], data: { perfis: ['cliente'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule {}
