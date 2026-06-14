# CLAUDE.md — Valeal Fardamentos

Arquivo de contexto permanente do projeto. Leia antes de qualquer ação.

---

## O Projeto

Sistema de vendas online de fardamentos para a empresa **Valeal Fardamentos**.
Permite que clientes comprem camisas e outros uniformes configurando material, tamanho e quantidade, com suporte a sublimação e chat em tempo real com um designer.

---

## Perfis de Usuário

| Perfil | Acesso | O que faz |
|---|---|---|
| **Cliente** | Portal público | Navega no catálogo, configura pedido, envia arte ou fala com designer |
| **Funcionário Designer** | Painel do funcionário | Recebe e responde chats em tempo real |
| **Administrador** | Painel admin | Gerencia materiais, preços, funcionários e pedidos |

---

## Stack

- **Frontend:** Angular 17+ — HTML em `.html` separado, lógica no `.ts`
- **Backend:** Node.js + Express
- **Banco:** PostgreSQL (ORM: Sequelize ou Prisma)
- **Realtime:** Socket.IO (chat cliente ↔ designer)
- **Upload:** Multer (artes para sublimação)
- **Auth:** JWT + bcrypt

---

## Regra de Ouro — Mock → Real

Todo o frontend é construído **primeiro com dados mockados**. Nenhuma chamada real de API ocorre na Fase 1.

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  useMock: true,           // ← muda para false na Fase 3
  apiUrl: 'http://localhost:3000/api'
};
```

Todo service segue este padrão obrigatório:

```typescript
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

const USE_MOCK = environment.useMock;

getMateriais(): Observable<Material[]> {
  if (USE_MOCK) {
    return of(MATERIAIS_MOCK).pipe(delay(300)); // simula latência
  }
  return this.http.get<Material[]>(`${environment.apiUrl}/materiais`);
}
```

O `delay(300)` é obrigatório no mock — força o componente a tratar o estado de loading desde o início.

Na Fase 3, apenas os services mudam. Os componentes `.html` e `.ts` não devem precisar de alteração.

---

## Regra Inviolável — Separação HTML / TS

```typescript
// ❌ NUNCA
@Component({ template: `<div>...</div>` })

// ✅ SEMPRE
@Component({
  templateUrl: './nome.component.html',
  styleUrls: ['./nome.component.scss']
})
```

- Todo HTML fica no `.html`
- Toda lógica fica no `.ts`
- Todo estilo fica no `.scss`
- Nunca use template ou styles inline

---

## Estrutura de Pastas — Frontend

```
src/
├── app/
│   ├── core/                        # Guards, interceptors, constantes
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   └── interceptors/
│   │       └── auth.interceptor.ts
│   ├── shared/                      # Componentes reutilizáveis
│   ├── models/                      # Interfaces TypeScript
│   │   ├── material.model.ts
│   │   ├── pedido.model.ts
│   │   └── usuario.model.ts
│   ├── services/                    # Services (mock ou real via flag)
│   │   ├── materiais.service.ts
│   │   ├── pedidos.service.ts
│   │   ├── chat.service.ts
│   │   └── auth.service.ts
│   ├── pages/
│   │   ├── cliente/                 # Módulo do cliente (público)
│   │   │   ├── home/
│   │   │   ├── catalogo/
│   │   │   ├── produto/
│   │   │   ├── carrinho/
│   │   │   ├── arte/
│   │   │   ├── chat/
│   │   │   └── confirmacao/
│   │   ├── admin/                   # Módulo admin (requer perfil admin)
│   │   │   ├── dashboard/
│   │   │   ├── materiais/
│   │   │   │   ├── list/
│   │   │   │   └── form/
│   │   │   ├── pedidos/
│   │   │   │   ├── list/
│   │   │   │   └── detalhe/
│   │   │   └── funcionarios/
│   │   ├── funcionario/             # Módulo designer (requer perfil funcionario)
│   │   │   ├── fila/
│   │   │   └── chat/
│   │   └── auth/                    # Login
│   └── app-routing.module.ts
├── assets/
│   └── mocks/                       # JSONs com dados mockados
└── environments/
    ├── environment.ts               # useMock: true
    └── environment.prod.ts          # useMock: false
```

---

## Estrutura de Pastas — Backend

```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── materiais.js
│   │   ├── pedidos.js
│   │   ├── chat.js
│   │   └── usuarios.js
│   ├── controllers/
│   ├── models/                      # Sequelize/Prisma
│   ├── middlewares/
│   │   ├── auth.middleware.js       # valida JWT
│   │   ├── role.middleware.js       # verifica perfil (admin/funcionario)
│   │   └── upload.middleware.js     # Multer
│   ├── socket/
│   │   └── chat.socket.js           # lógica Socket.IO
│   └── config/
│       ├── database.js
│       └── jwt.js
├── uploads/                         # artes enviadas pelos clientes
└── server.js
```

---

## Modelos de Dados (TypeScript)

### material.model.ts

```typescript
export interface Material {
  id: number;
  nome: string;
  tipo: 'liso' | 'sublimacao';
  descricao: string;
  imagem_url: string;
  ativo: boolean;
  permite_sublimacao: boolean;
  tamanhos: TamanhoMaterial[];
  criado_em: Date;
}

export interface TamanhoMaterial {
  id: number;
  material_id: number;
  tamanho: 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XGG';
  preco_unitario: number;
  preco_atacado: number;
  qtd_minima_atacado: number;
  estoque: number;
  ativo: boolean;
}
```

### pedido.model.ts

```typescript
export type StatusPedido =
  | 'aguardando_arte'
  | 'em_producao'
  | 'enviado'
  | 'entregue'
  | 'cancelado';

export interface Pedido {
  id: number;
  cliente_id: number;
  status: StatusPedido;
  tem_arte: boolean;
  arte_url: string | null;
  observacoes: string;
  total: number;
  criado_em: Date;
  itens: ItemPedido[];
}

export interface ItemPedido {
  id: number;
  pedido_id: number;
  material_id: number;
  tamanho: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}
```

### usuario.model.ts

```typescript
export type PerfilUsuario = 'cliente' | 'funcionario' | 'admin';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  ativo: boolean;
  criado_em: Date;
}

export interface SessaoChat {
  id: number;
  cliente_id: number;
  funcionario_id: number | null;
  status: 'aguardando' | 'ativo' | 'encerrado';
  criado_em: Date;
  mensagens: MensagemChat[];
}

export interface MensagemChat {
  id: number;
  sessao_id: number;
  autor_id: number;
  texto: string;
  criado_em: Date;
}
```

---

## Rotas Angular

```
/                          → HomeComponent (público)
/catalogo                  → CatalogoComponent (público)
/produto/:id               → ProdutoComponent (público)
/carrinho                  → CarrinhoComponent (cliente autenticado)
/pedido/arte               → ArteComponent (cliente autenticado)
/pedido/chat               → ChatClienteComponent (cliente autenticado)
/pedido/confirmacao        → ConfirmacaoComponent (cliente autenticado)

/admin                     → DashboardAdminComponent (perfil: admin)
/admin/materiais           → MateriaisListComponent (perfil: admin)
/admin/materiais/novo      → MaterialFormComponent (perfil: admin)
/admin/materiais/:id/editar → MaterialFormComponent (perfil: admin)
/admin/pedidos             → PedidosAdminComponent (perfil: admin)
/admin/pedidos/:id         → PedidoDetalheComponent (perfil: admin)
/admin/funcionarios        → FuncionariosComponent (perfil: admin)

/funcionario/fila          → FilaChatsComponent (perfil: funcionario)
/funcionario/chat/:sessaoId → ChatDesignerComponent (perfil: funcionario)

/login                     → LoginComponent (público)
```

---

## Rotas da API (Backend)

### Auth
```
POST   /api/auth/login       → login, retorna JWT
POST   /api/auth/register    → cadastro de cliente
GET    /api/auth/me          → dados do usuário autenticado
```

### Materiais
```
GET    /api/materiais          → lista ativos (público)
GET    /api/materiais/:id      → detalhe com tamanhos (público)
POST   /api/materiais          → criar (admin)
PUT    /api/materiais/:id      → editar (admin)
PATCH  /api/materiais/:id/toggle → ativar/desativar (admin)
DELETE /api/materiais/:id      → soft delete (admin)
```

### Pedidos
```
POST   /api/pedidos            → criar pedido com arte (multipart/form-data)
GET    /api/pedidos/meus       → pedidos do cliente autenticado
GET    /api/pedidos            → todos os pedidos (admin)
GET    /api/pedidos/:id        → detalhe (admin ou cliente dono)
PATCH  /api/pedidos/:id/status → atualizar status (admin)
```

### Chat (Socket.IO)
```
POST   /api/chat/sessoes       → criar sessão de chat (cliente)
GET    /api/chat/sessoes       → sessões abertas (funcionario/admin)

Eventos emitidos pelo cliente:
  entrar_sala       { sessaoId, usuarioId }
  nova_mensagem     { sessaoId, texto }
  encerrar_chat     { sessaoId }

Eventos recebidos:
  mensagem_recebida { mensagem: MensagemChat }
  designer_entrou   { funcionario: Usuario }
  chat_encerrado    { sessaoId }
```

---

## Fluxo de Compra — Resumo

**Cliente com arte:**
Catálogo → Produto (escolhe tamanho + qtd) → Carrinho → "Tenho a arte" → Upload do arquivo → Confirmação

**Cliente sem arte:**
Catálogo → Produto → Carrinho → "Não tenho a arte" → Chat com designer → Combinam arte → Confirmação

**Lógica de preço no ProdutoComponent:**
```typescript
// Se quantidade >= qtd_minima_atacado → usa preco_atacado
// Caso contrário → usa preco_unitario
// Mostrar badge "ATACADO" quando atingir o mínimo
get precoAtual(): number {
  const tamanho = this.tamanhoSelecionado;
  if (!tamanho) return 0;
  return this.quantidade >= tamanho.qtd_minima_atacado
    ? tamanho.preco_atacado
    : tamanho.preco_unitario;
}
```

---

## Dados Mock Obrigatórios

Sempre que criar ou referenciar dados mock, use estes 4 materiais base:

```typescript
export const MATERIAIS_MOCK: Material[] = [
  {
    id: 1,
    nome: 'Camisa Algodão Fio 30',
    tipo: 'liso',
    descricao: 'Camisa lisa de algodão fio 30, confortável e durável.',
    imagem_url: 'assets/images/camisa-algodao.jpg',
    ativo: true,
    permite_sublimacao: false,
    tamanhos: [
      { id: 1, material_id: 1, tamanho: 'PP', preco_unitario: 35.00, preco_atacado: 28.00, qtd_minima_atacado: 10, estoque: 50, ativo: true },
      { id: 2, material_id: 1, tamanho: 'P',  preco_unitario: 35.00, preco_atacado: 28.00, qtd_minima_atacado: 10, estoque: 60, ativo: true },
      { id: 3, material_id: 1, tamanho: 'M',  preco_unitario: 35.00, preco_atacado: 28.00, qtd_minima_atacado: 10, estoque: 80, ativo: true },
      { id: 4, material_id: 1, tamanho: 'G',  preco_unitario: 38.00, preco_atacado: 30.00, qtd_minima_atacado: 10, estoque: 70, ativo: true },
      { id: 5, material_id: 1, tamanho: 'GG', preco_unitario: 40.00, preco_atacado: 32.00, qtd_minima_atacado: 10, estoque: 40, ativo: true },
      { id: 6, material_id: 1, tamanho: 'XGG',preco_unitario: 43.00, preco_atacado: 35.00, qtd_minima_atacado: 10, estoque: 20, ativo: true },
    ],
    criado_em: new Date('2024-01-01'),
  },
  {
    id: 2,
    nome: 'Camisa DryFit',
    tipo: 'liso',
    descricao: 'Camisa DryFit de alta performance, tecido que afasta o suor.',
    imagem_url: 'assets/images/camisa-dryfit.jpg',
    ativo: true,
    permite_sublimacao: false,
    tamanhos: [
      { id: 7,  material_id: 2, tamanho: 'PP', preco_unitario: 42.00, preco_atacado: 34.00, qtd_minima_atacado: 12, estoque: 45, ativo: true },
      { id: 8,  material_id: 2, tamanho: 'P',  preco_unitario: 42.00, preco_atacado: 34.00, qtd_minima_atacado: 12, estoque: 55, ativo: true },
      { id: 9,  material_id: 2, tamanho: 'M',  preco_unitario: 42.00, preco_atacado: 34.00, qtd_minima_atacado: 12, estoque: 65, ativo: true },
      { id: 10, material_id: 2, tamanho: 'G',  preco_unitario: 45.00, preco_atacado: 36.00, qtd_minima_atacado: 12, estoque: 50, ativo: true },
      { id: 11, material_id: 2, tamanho: 'GG', preco_unitario: 47.00, preco_atacado: 38.00, qtd_minima_atacado: 12, estoque: 30, ativo: true },
    ],
    criado_em: new Date('2024-01-01'),
  },
  {
    id: 3,
    nome: 'Camisa Polo Piquet',
    tipo: 'liso',
    descricao: 'Camisa polo de piquet, visual elegante para uniformes corporativos.',
    imagem_url: 'assets/images/camisa-polo.jpg',
    ativo: true,
    permite_sublimacao: false,
    tamanhos: [
      { id: 12, material_id: 3, tamanho: 'P',  preco_unitario: 55.00, preco_atacado: 44.00, qtd_minima_atacado: 10, estoque: 40, ativo: true },
      { id: 13, material_id: 3, tamanho: 'M',  preco_unitario: 55.00, preco_atacado: 44.00, qtd_minima_atacado: 10, estoque: 50, ativo: true },
      { id: 14, material_id: 3, tamanho: 'G',  preco_unitario: 58.00, preco_atacado: 46.00, qtd_minima_atacado: 10, estoque: 45, ativo: true },
      { id: 15, material_id: 3, tamanho: 'GG', preco_unitario: 60.00, preco_atacado: 48.00, qtd_minima_atacado: 10, estoque: 25, ativo: true },
    ],
    criado_em: new Date('2024-01-01'),
  },
  {
    id: 4,
    nome: 'Camiseta Sublimação 100% Poliéster',
    tipo: 'sublimacao',
    descricao: 'Camiseta 100% poliéster ideal para sublimação total. Aceita qualquer arte.',
    imagem_url: 'assets/images/camisa-sublimacao.jpg',
    ativo: true,
    permite_sublimacao: true,
    tamanhos: [
      { id: 16, material_id: 4, tamanho: 'PP', preco_unitario: 48.00, preco_atacado: 38.00, qtd_minima_atacado: 15, estoque: 100, ativo: true },
      { id: 17, material_id: 4, tamanho: 'P',  preco_unitario: 48.00, preco_atacado: 38.00, qtd_minima_atacado: 15, estoque: 100, ativo: true },
      { id: 18, material_id: 4, tamanho: 'M',  preco_unitario: 48.00, preco_atacado: 38.00, qtd_minima_atacado: 15, estoque: 100, ativo: true },
      { id: 19, material_id: 4, tamanho: 'G',  preco_unitario: 51.00, preco_atacado: 41.00, qtd_minima_atacado: 15, estoque: 100, ativo: true },
      { id: 20, material_id: 4, tamanho: 'GG', preco_unitario: 53.00, preco_atacado: 43.00, qtd_minima_atacado: 15, estoque: 100, ativo: true },
      { id: 21, material_id: 4, tamanho: 'XGG',preco_unitario: 56.00, preco_atacado: 46.00, qtd_minima_atacado: 15, estoque: 80,  ativo: true },
    ],
    criado_em: new Date('2024-01-01'),
  },
];
```

---

## Convenções de Nomenclatura

| Artefato | Padrão | Exemplo |
|---|---|---|
| Componente | `NomeComponent` | `MateriaisListComponent` |
| Service | `NomeService` | `MateriaisService` |
| Interface | PascalCase | `Material`, `ItemPedido` |
| Arquivo HTML | `nome.component.html` | `materiais-list.component.html` |
| Arquivo TS | `nome.component.ts` | `materiais-list.component.ts` |
| Rota Angular | kebab-case | `/admin/materiais/novo` |
| Rota API | kebab-case | `/api/pedidos/:id/status` |
| Constantes mock | `NOME_MOCK` | `MATERIAIS_MOCK` |

---

## Ordem de Desenvolvimento

Siga esta sequência. Não pule etapas.

```
Fase 1A — Admin Frontend (mock)
  ✅ Estrutura do projeto Angular + interfaces + environments
  ✅ AuthModule: login com mock JWT
  ✅ AdminModule: routing + AuthGuard (perfil admin)
  ✅ Dashboard admin: KPIs mockados
  ✅ MateriaisListComponent: tabela + filtros
  ✅ MaterialFormComponent: form com tamanhos/preços dinâmicos
  ✅ PedidosAdminComponent: lista + filtro por status
  ✅ PedidoDetalheComponent: detalhe + atualizar status
  ✅ FuncionariosComponent: CRUD mock

Fase 1B — Cliente Frontend (mock)
  ✅ HomeComponent: banner + destaques
  ✅ CatalogoComponent: cards + filtro por tipo
  ✅ ProdutoComponent: seletor tamanho + cálculo preço atacado
  ✅ CarrinhoComponent: itens + totais
  ✅ ArteComponent: bifurcação "tenho arte" / "não tenho arte"
  ✅ ChatClienteComponent: chat mockado com setTimeout
  ✅ ConfirmacaoComponent: pedido confirmado

Fase 1C — Funcionário Frontend (mock)
  ✅ FuncionarioModule: routing + AuthGuard (perfil funcionario)
  ✅ FilaChatsComponent: fila de clientes aguardando
  ✅ ChatDesignerComponent: chat com histórico

Fase 2 — Backend Node.js
  ✅ Express + PostgreSQL + JWT + Multer
  ✅ Modelos do banco (Sequelize/Prisma)
  ✅ Rotas de auth
  ✅ Rotas de materiais
  ✅ Rotas de pedidos + upload de arte
  ✅ Socket.IO para chat em tempo real

Fase 3 — Integração
  ✅ environment.useMock = false
  ✅ Services apontando para API real
  ✅ Chat Socket.IO real substituindo mock
  ✅ Testes E2E
```

---

## Como Rodar (após setup)

```bash
# Frontend
cd valeal-frontend
npm install
ng serve

# Backend
cd valeal-backend
npm install
node server.js    # ou: npm run dev (com nodemon)
```

---

## Design System — Valeal Fardamentos

### Biblioteca de Componentes

**PrimeNG** é a biblioteca oficial do projeto. Nenhum outro framework de UI deve ser usado.

```bash
# Instalação obrigatória
npm install primeng primeicons @primengng/themes
```

```typescript
// main.ts — configuração global obrigatória
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: { darkModeSelector: false } // sem dark mode por padrão
      }
    })
  ]
});
```

---

### Identidade Visual

**Vibe:** Moderno e tech — limpo, preciso, com personalidade. Sem gradientes excessivos, sem sombras pesadas. Peso visual concentrado na tipografia e nos acentos de cor.

**Paleta oficial:**

| Token | Hex | Uso |
|---|---|---|
| `--color-primary` | `#1A3A5C` | Azul escuro — cor dominante, headers, sidebar, botões principais |
| `--color-accent` | `#E8760A` | Laranja — chamadas para ação, badges, destaques, hover states |
| `--color-primary-light` | `#2A5480` | Azul médio — hover do primário, elementos secundários |
| `--color-accent-light` | `#F59340` | Laranja claro — estados desabilitados do acento, ícones secundários |
| `--color-surface` | `#F4F6F9` | Fundo geral da aplicação |
| `--color-surface-card` | `#FFFFFF` | Fundo de cards e painéis |
| `--color-border` | `#DEE2E8` | Bordas e divisores |
| `--color-text-primary` | `#1A1F2E` | Texto principal |
| `--color-text-secondary` | `#6B7280` | Texto secundário, labels, placeholders |
| `--color-success` | `#22C55E` | Status: entregue, ativo |
| `--color-warning` | `#F59E0B` | Status: em produção, aguardando |
| `--color-danger` | `#EF4444` | Status: cancelado, erros |
| `--color-info` | `#3B82F6` | Status: enviado, informativo |

**Definição no styles.scss global:**

```scss
:root {
  --color-primary:        #1A3A5C;
  --color-primary-light:  #2A5480;
  --color-accent:         #E8760A;
  --color-accent-light:   #F59340;
  --color-surface:        #F4F6F9;
  --color-surface-card:   #FFFFFF;
  --color-border:         #DEE2E8;
  --color-text-primary:   #1A1F2E;
  --color-text-secondary: #6B7280;
  --color-success:        #22C55E;
  --color-warning:        #F59E0B;
  --color-danger:         #EF4444;
  --color-info:           #3B82F6;

  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;

  --shadow-sm:   0 1px 3px rgba(0,0,0,0.08);
  --shadow-md:   0 4px 12px rgba(0,0,0,0.10);
  --shadow-lg:   0 8px 24px rgba(0,0,0,0.12);

  --font-family: 'Inter', 'Segoe UI', sans-serif;
}
```

---

### Tipografia

Fonte principal: **Inter** (Google Fonts).

```html
<!-- index.html — adicionar no <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

| Elemento | Tamanho | Peso | Cor |
|---|---|---|---|
| Título de página | `28px` | `700` | `--color-text-primary` |
| Subtítulo / H2 | `20px` | `600` | `--color-text-primary` |
| Label de seção | `13px` | `600` | `--color-text-secondary` (uppercase) |
| Corpo | `14px` | `400` | `--color-text-primary` |
| Caption / helper | `12px` | `400` | `--color-text-secondary` |
| Valor monetário | `18px` | `700` | `--color-primary` |
| Badge / tag | `11px` | `600` | varia por contexto |

---

### Layout dos Painéis (Admin e Funcionário)

```
┌─────────────────────────────────────────────────┐
│  SIDEBAR (260px, bg: --color-primary)           │
│  ┌─────────────────┐  ┌──────────────────────┐  │
│  │ Logo Valeal     │  │  TOPBAR (64px)       │  │
│  │─────────────────│  │  título + avatar     │  │
│  │ nav item        │  ├──────────────────────┤  │
│  │ nav item ◄ ativo│  │                      │  │
│  │ nav item        │  │  CONTENT AREA        │  │
│  │                 │  │  bg: --color-surface │  │
│  │                 │  │  padding: 24px       │  │
│  └─────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────┘
```

- Sidebar fixa, 260px, fundo `--color-primary`
- Itens de nav: texto branco, ícone PrimeIcons, padding `12px 20px`
- Item ativo: fundo `--color-accent`, texto branco, borda-left `3px solid white`
- Topbar: fundo branco, `border-bottom: 1px solid --color-border`, altura `64px`
- Content area: fundo `--color-surface`, padding `24px`

---

### Padrões de Componentes PrimeNG

**Botões:**
```html
<!-- Primário -->
<p-button label="Salvar" icon="pi pi-check" />

<!-- Secundário -->
<p-button label="Cancelar" severity="secondary" [outlined]="true" />

<!-- Ação destrutiva -->
<p-button label="Excluir" severity="danger" icon="pi pi-trash" />

<!-- Acento (laranja) — usar classe customizada -->
<p-button label="Novo Material" icon="pi pi-plus" styleClass="btn-accent" />
```

```scss
// styles.scss — botão acento global
.btn-accent .p-button {
  background-color: var(--color-accent);
  border-color: var(--color-accent);
  &:hover { background-color: var(--color-accent-light); }
}
```

**Cards:**
```html
<p-card styleClass="valeal-card">
  <ng-template pTemplate="header"> ... </ng-template>
  <!-- conteúdo -->
</p-card>
```
```scss
.valeal-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}
```

**Tabelas:**
```html
<p-table [value]="items" [paginator]="true" [rows]="10"
         styleClass="p-datatable-sm p-datatable-striped">
```

**Badges de status de pedido:**
```html
<p-tag [value]="status | statusLabel" [severity]="status | statusSeverity" />
```
```typescript
// status.pipe.ts
const STATUS_MAP = {
  aguardando_arte: { label: 'Aguardando Arte', severity: 'warn' },
  em_producao:     { label: 'Em Produção',     severity: 'info' },
  enviado:         { label: 'Enviado',          severity: 'info' },
  entregue:        { label: 'Entregue',         severity: 'success' },
  cancelado:       { label: 'Cancelado',        severity: 'danger' },
};
```

**Formulários:**
```html
<div class="field">
  <label for="nome" class="field-label">Nome do Material</label>
  <input pInputText id="nome" formControlName="nome" class="w-full" />
  <small class="p-error" *ngIf="form.get('nome')?.invalid && form.get('nome')?.touched">
    Nome é obrigatório
  </small>
</div>
```

---

### Tela de Login — Especificação

Layout dividido em 2 colunas (desktop) / coluna única (mobile):

```
┌──────────────────┬──────────────────────┐
│                  │                      │
│   PAINEL         │   FORMULÁRIO         │
│   ESQUERDO       │                      │
│   (45%)          │   (55%)              │
│                  │                      │
│   bg: linear-    │   bg: white          │
│   gradient(135°, │                      │
│   #1A3A5C,       │   Logo centrado      │
│   #2A5480)       │   ──────────         │
│                  │   "Bem-vindo de      │
│   Logo grande    │    volta"            │
│   branca         │                      │
│                  │   campo e-mail       │
│   "Fardamentos   │   campo senha        │
│    sob medida    │                      │
│    para sua      │   [ Entrar ]         │
│    equipe"       │                      │
│                  │   "Não tem conta?    │
│   3 bullets de   │    Cadastre-se"      │
│   diferenciais   │                      │
└──────────────────┴──────────────────────┘
```

Regras visuais do login:
- Painel esquerdo: gradiente `135deg, #1A3A5C → #2A5480`, sem imagens
- Bullets dos diferenciais: ícone `pi pi-check-circle` na cor `--color-accent`
- Botão entrar: largura total, fundo `--color-primary`, hover `--color-primary-light`
- Input em foco: borda `--color-accent`
- Sem box-shadow no card — o layout de duas colunas já dá profundidade suficiente
- Responsivo: abaixo de 768px, painel esquerdo some, formulário ocupa tela toda

---

### Regras de Design para o Claude Code

1. **Sempre usar PrimeNG** — nunca criar componentes de UI do zero quando existe equivalente no PrimeNG
2. **Sempre usar variáveis CSS** — nunca cores hardcoded no SCSS (`color: #1A3A5C` ❌ → `color: var(--color-primary)` ✅)
3. **Ícones via PrimeIcons** — prefixo `pi pi-nome` (ex: `pi pi-user`, `pi pi-shopping-cart`)
4. **Espaçamento em múltiplos de 4px** — 4, 8, 12, 16, 24, 32, 48px
5. **Nunca usar `!important`** — resolver especificidade com seletores corretos
6. **Mobile-first** — todos os componentes devem funcionar em 375px de largura mínima
7. **Estados de loading obrigatórios** — todo componente que aguarda dados deve mostrar `<p-skeleton>` ou `<p-progressSpinner>`
8. **Feedback de ação obrigatório** — todo save/delete deve usar `MessageService` do PrimeNG (`p-toast`)

---

## Responsividade

### Breakpoints Oficiais

Seguir estes breakpoints em todo o projeto. Nunca criar breakpoints arbitrários.

```scss
// src/styles/breakpoints.scss — importar em todo .scss que precisar
$bp-xs:  375px;  // celular pequeno (mínimo suportado)
$bp-sm:  576px;  // celular grande
$bp-md:  768px;  // tablet portrait
$bp-lg:  1024px; // tablet landscape / notebook pequeno
$bp-xl:  1280px; // desktop padrão
$bp-2xl: 1536px; // desktop grande

// Mixins prontos para uso
@mixin xs    { @media (max-width: #{$bp-sm - 1})  { @content; } }
@mixin sm    { @media (max-width: #{$bp-md - 1})  { @content; } }
@mixin md    { @media (max-width: #{$bp-lg - 1})  { @content; } }
@mixin lg    { @media (max-width: #{$bp-xl - 1})  { @content; } }
@mixin sm-up { @media (min-width: #{$bp-sm})      { @content; } }
@mixin md-up { @media (min-width: #{$bp-md})      { @content; } }
@mixin lg-up { @media (min-width: #{$bp-lg})      { @content; } }
```

---

### Sidebar (Admin e Funcionário)

**Desktop (≥ 1024px):** sidebar fixa, sempre visível, 260px de largura.

**Tablet (768px – 1023px):** sidebar recolhida — exibe apenas ícones (64px de largura). Hover no ícone expande com tooltip do label.

**Mobile (< 768px):** sidebar oculta por padrão. Topbar exibe botão hamburguer (`pi pi-bars`). Ao clicar, sidebar desliza sobre o conteúdo como drawer (overlay escuro atrás). Fechar ao clicar fora ou em qualquer item de menu.

```scss
.sidebar {
  width: 260px;
  transition: width 0.2s ease, transform 0.2s ease;

  @include md {
    width: 64px;
  }

  @include sm {
    width: 260px;
    position: fixed;
    transform: translateX(-100%);
    z-index: 1000;

    &.open {
      transform: translateX(0);
    }
  }
}

.sidebar-overlay {
  display: none;

  @include sm {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
}
```

---

### Grid de Cards (Catálogo)

Usar CSS Grid com `auto-fill` — nunca número fixo de colunas hardcoded.

```scss
.catalogo-grid {
  display: grid;
  gap: 24px;

  // Desktop: 4 colunas
  grid-template-columns: repeat(4, 1fr);

  // Notebook / tablet landscape
  @include lg {
    grid-template-columns: repeat(3, 1fr);
  }

  // Tablet portrait
  @include md {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  // Mobile
  @include sm {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
```

Card de produto no mobile: imagem no topo, conteúdo abaixo, botão "Ver produto" largura total.

---

### Tabelas (Admin)

Tabelas do PrimeNG **não colapsam automaticamente** no mobile. Padrão obrigatório:

**Desktop (≥ 768px):** `p-table` normal com todas as colunas visíveis.

**Mobile (< 768px):** ocultar a tabela e exibir uma lista de cards no lugar. Cada card representa uma linha da tabela com os campos empilhados verticalmente.

```html
<!-- tabela — visível só no desktop -->
<p-table [value]="items" class="hide-mobile">
  ...
</p-table>

<!-- cards — visíveis só no mobile -->
<div class="mobile-list show-mobile">
  <div class="mobile-card" *ngFor="let item of items">
    <div class="mobile-card__header">
      <span class="mobile-card__title">{{ item.nome }}</span>
      <p-tag [value]="item.status" />
    </div>
    <div class="mobile-card__row">
      <span class="mobile-card__label">Tipo</span>
      <span>{{ item.tipo }}</span>
    </div>
    <div class="mobile-card__actions">
      <p-button icon="pi pi-pencil" severity="secondary" [outlined]="true" size="small" />
      <p-button icon="pi pi-trash" severity="danger" [outlined]="true" size="small" />
    </div>
  </div>
</div>
```

```scss
.hide-mobile { @include sm { display: none; } }
.show-mobile { display: none; @include sm { display: block; } }

.mobile-card {
  background: var(--color-surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 12px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  &__title {
    font-weight: 600;
    font-size: 14px;
    color: var(--color-text-primary);
  }

  &__row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px solid var(--color-border);
    font-size: 13px;
  }

  &__label {
    color: var(--color-text-secondary);
    font-weight: 500;
  }

  &__actions {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    justify-content: flex-end;
  }
}
```

---

### Formulários

**Desktop:** campos lado a lado em grid de 2 colunas quando fizer sentido (ex: nome + tipo).

**Mobile:** todos os campos em coluna única, largura total.

```scss
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @include sm {
    grid-template-columns: 1fr;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  // Campo que deve sempre ocupar largura total (ex: descrição, observações)
  &.full-width {
    grid-column: 1 / -1;
  }
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

// Todos os inputs PrimeNG: largura total por padrão
p-inputtext,
p-dropdown,
p-inputnumber,
p-textarea,
p-select {
  width: 100%;
}
```

---

### Tela de Login

**Desktop (≥ 768px):** duas colunas — painel esquerdo azul (45%) + formulário branco (55%).

**Mobile (< 768px):** painel esquerdo some completamente. Formulário ocupa a tela toda com logo da Valeal no topo centralizada.

```scss
.login-container {
  display: grid;
  grid-template-columns: 45% 55%;
  min-height: 100vh;

  @include sm {
    grid-template-columns: 1fr;
  }
}

.login-panel-left {
  @include sm {
    display: none;
  }
}

.login-form-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px;

  @include sm {
    padding: 32px 24px;
  }
}
```

---

### Chat (Cliente e Funcionário)

**Desktop:** área de mensagens com altura fixa (`calc(100vh - 180px)`), input fixo no rodapé.

**Mobile:** ocupa a tela toda. Header com nome do atendente + botão fechar. Área de mensagens `calc(100vh - 140px)`. Input de texto com botão enviar ao lado, ambos com altura mínima de `48px` (área de toque adequada).

```scss
.chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 180px);

  @include sm {
    height: calc(100vh - 140px);
    position: fixed;
    inset: 0;
    z-index: 500;
    background: var(--color-surface-card);
  }
}

.chat-input-area {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--color-border);

  input {
    flex: 1;
    min-height: 48px; // área de toque mínima no mobile
  }

  button {
    min-width: 48px;
    min-height: 48px;
  }
}
```

---

### Regras Gerais de Responsividade

1. **Mínimo suportado é 375px** — testar sempre nessa largura antes de considerar pronto
2. **Área de toque mínima de 44px** — botões, links e itens clicáveis no mobile nunca menores que isso
3. **Nunca usar `px` fixo para larguras de container** — usar `%`, `fr`, `vw` ou `max-width` com `width: 100%`
4. **Imagens sempre com `max-width: 100%`** — nunca deixar imagem vazar o container
5. **Fonte mínima de 13px no mobile** — nunca menor, mesmo em captions
6. **Padding horizontal de no mínimo 16px** — em qualquer tela mobile, conteúdo nunca cola nas bordas
7. **Testar overflow horizontal** — nenhuma tela deve ter scroll horizontal no mobile

---

## Observações Importantes

- O administrador cadastra **qualquer material** com os tamanhos e preços que quiser — não existe lista fixa de materiais no código
- Materiais do tipo `sublimacao` exibem no produto a bifurcação arte/chat
- Materiais do tipo `liso` seguem direto para o carrinho sem etapa de arte
- O chat só é iniciado quando o cliente clica em "Falar com um Designer" — não é obrigatório
- Funcionários são cadastrados **somente pelo administrador** — não há cadastro público para o perfil funcionário
- Upload de arte aceita: PNG, JPG, PDF, AI, CDR (validar no frontend e no backend)
