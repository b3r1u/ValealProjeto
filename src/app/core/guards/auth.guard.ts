import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PerfilUsuario } from '../../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const perfis: PerfilUsuario[] = route.data['perfis'];

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    if (perfis && !perfis.includes(this.authService.getPerfil()!)) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
