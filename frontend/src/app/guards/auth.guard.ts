import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { AuthService } from '../public/services/auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

	constructor(private router: Router, private jwtService : JwtHelperService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		
	if (this.jwtService.isTokenExpired()) {
		this.router.navigate(['/home']);
		return false;
	} else {
		return true;
	}
  }
//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     if (this.authService.isLoggedIn()) {
//       // Si l'utilisateur est connecté, rediriger vers une autre page
//       this.router.navigate(['/private/chat/dashboard']);
//       return false;
//     } else {
//       // Sinon, autoriser l'accès à la page
//       return true;
//     }
//   }
  
}
