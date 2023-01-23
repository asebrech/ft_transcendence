import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../../services/auth-service/auth.service';
import { AccessTokenI } from 'src/app/model/access-token.interface';

@Component({
  selector: 'app-api-login',
  templateUrl: './api-login.component.html',
  styleUrls: ['./api-login.component.scss']
})
export class ApiLoginComponent implements OnInit {

	code: string;

	constructor(private route: ActivatedRoute, private http: HttpClient, private authService: AuthService, private router: Router) {}

	login() {
		
		const clientId = 'u-s4t2ud-555dc7231ce9896ca6b978542a200be75b8ddd2b1569e6621355172e4c6ec0e2'
		const redirect_uri = 'http://localhost:4200'
		const url= `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirect_uri}&response_type=code`
		window.location.href = url;
	}

	ngOnInit() {
		this.route.queryParams.subscribe(params => {
		  this.code = params['code'];});
		  if (this.code) {
			this.authService.exchangeCodeForToken(this.code).pipe(
				tap(token => this.authService.apiLogin(token).pipe(
					tap(() => this.router.navigate(['../../private/dashboard'], { replaceUrl: true }))
				).subscribe())
				).subscribe();
		  }
	  }

	
}
