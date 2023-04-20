import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subject, tap } from 'rxjs';
import { AccessTokenI } from 'src/app/model/access-token.interface';
import { LoginResponseI } from 'src/app/model/login-response';
import { UserI } from 'src/app/model/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private snackbar: MatSnackBar, private jwtService: JwtHelperService, private router: Router) { }

  login(user: UserI) {
	const response = this.http.post<LoginResponseI>('api/users/login', user);
	this.loginHandler(response);
  }

  apiLogin (token: AccessTokenI) {
	const response = this.http.post<LoginResponseI>('api/users/api-login', token);
	this.loginHandler(response);
  }

  loginHandler(response: Observable<LoginResponseI>) {
	return response.subscribe(response => {
		if (response.access_token) {
			localStorage.setItem('access_token', response.access_token);
			this.snackbar.open('Login Successfull', 'Close', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'});
			this.router.navigate(['../../private/game/spacepong']);
		}
		else if(response.session) {
			this.router.navigate(['../../public/google-auth'], {queryParams: {session: response.session}});
		}
	});
  }

  exchangeCodeForToken(code: string): Observable<AccessTokenI> {
	const body = {
	  code: code,
	  client_id: environment.CLIENT_ID,
	  client_secret: environment.CLIENT_SECRET,
	  grant_type: environment.GRANT_TYPE,
	  redirect_uri: environment.REDIRECT_URI
	};

	return this.http.post<AccessTokenI>('https://api.intra.42.fr/oauth/token', body);
}

  getLoggedInUser(): UserI {
	const decodedToken = this.jwtService.decodeToken();
	return decodedToken.user;
  }

  isLoggedIn() {
	const token = localStorage.getItem('access_token');
	return !this.jwtService.isTokenExpired(token);
  }
}
