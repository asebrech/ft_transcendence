import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';
import { environment } from 'src/environment';

@Component({
  selector: 'app-api-login',
  templateUrl: './api-login.component.html',
  styleUrls: ['./api-login.component.scss']
})
export class ApiLoginComponent implements OnInit {

	code: string;

	constructor(private route: ActivatedRoute, private http: HttpClient, private authService: AuthService, private router: Router) {}

	login() {
		const clientId = environment.CLIENT_ID;
		const redirect_uri = environment.REDIRECT_URI
		const url= `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirect_uri}&response_type=code`
		window.location.href = url;
	}

	ngOnInit() {
		this.route.queryParams.subscribe(params => {
		  this.code = params['code'];});
		  if (this.code) {
			this.authService.exchangeCodeForToken(this.code).subscribe(token => this.authService.apiLogin(token));
		  }
	  }

	
}
