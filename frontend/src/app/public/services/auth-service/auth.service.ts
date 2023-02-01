import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subject, tap } from 'rxjs';
import { AccessTokenI } from 'src/app/model/access-token.interface';
import { LoginResponseI } from 'src/app/model/login-response';
import { UserI } from 'src/app/model/user.interface';

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
			this.router.navigate(['../../private/chat/dashboard']);
		}
		else if(response.session) {
			this.router.navigate(['../../public/google-auth'], {queryParams: {session: response.session}});
		}
	});
  }

  exchangeCodeForToken(code: string): Observable<AccessTokenI> {
	const body = {
	  code: code,
	  client_id: 'u-s4t2ud-555dc7231ce9896ca6b978542a200be75b8ddd2b1569e6621355172e4c6ec0e2',
	  client_secret: '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',
	  grant_type: 'authorization_code',
	  redirect_uri: 'http://localhost:4200/public/login'
	};

	return this.http.post<AccessTokenI>('https://api.intra.42.fr/oauth/token', body);
}

  getLoggedInUser() {
	const decodedToken = this.jwtService.decodeToken();
	return decodedToken.user;
  }
}
