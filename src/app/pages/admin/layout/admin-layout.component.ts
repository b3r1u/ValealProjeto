import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { LoadingService } from '../../../services/loading.service';
import { Usuario } from '../../../models/usuario.model';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  exact?: boolean;
}

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  sidebarAberta = false;
  usuario: Usuario | null = null;

  navItems: NavItem[] = [
    { label: 'Dashboard',    route: '/admin',              icon: 'pi-th-large',     exact: true },
    { label: 'Materiais',    route: '/admin/materiais',    icon: 'pi-box' },
    { label: 'Pedidos',      route: '/admin/pedidos',      icon: 'pi-shopping-cart' },
    { label: 'Funcionários', route: '/admin/funcionarios', icon: 'pi-users' },
  ];

  tituloPagina = 'Dashboard';

  private routerSub?: Subscription;
  private loadingTimer?: ReturnType<typeof setTimeout>;

  private tituloMap: Record<string, string> = {
    '/admin':                 'Dashboard',
    '/admin/materiais':       'Materiais',
    '/admin/materiais/novo':  'Novo Material',
    '/admin/pedidos':         'Pedidos',
    '/admin/funcionarios':    'Funcionários',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    this.atualizarTitulo(this.router.url);

    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        clearTimeout(this.loadingTimer);
        this.loadingService.show();
        this.loadingTimer = setTimeout(() => this.loadingService.hide(), 1500);
      }
      if (event instanceof NavigationEnd) {
        this.atualizarTitulo(event.urlAfterRedirects);
        this.sidebarAberta = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    clearTimeout(this.loadingTimer);
  }

  toggleSidebar(): void {
    this.sidebarAberta = !this.sidebarAberta;
  }

  fecharSidebar(): void {
    this.sidebarAberta = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private atualizarTitulo(url: string): void {
    const rota = Object.keys(this.tituloMap).find(k => url.startsWith(k) && (k === url || url[k.length] === '/'))
      ?? Object.keys(this.tituloMap).find(k => url.startsWith(k));
    this.tituloPagina = rota ? this.tituloMap[rota] : 'Admin';
  }

  get iniciais(): string {
    return this.usuario?.nome
      ?.split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase() ?? 'AD';
  }
}
