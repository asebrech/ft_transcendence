import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../public/services/auth-service/auth.service';

@Injectable({
providedIn: 'root'
})
export class AuthGuardReverse implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/private/chat/dashboard']);
      return false;
    }

    return true;
  }
}