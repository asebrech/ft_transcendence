import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { AuthService } from '../../services/auth-service/auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { LoginResponseI } from 'src/app/model/login-response';

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.scss']
})
export class GoogleAuthComponent implements OnInit, OnDestroy{;

	session: any;
	token: string;

  constructor(private http: HttpClient, private authService: AuthService, private route: ActivatedRoute, private router : Router) { }

  ngOnInit() {
	this.session = this.route.snapshot.queryParams;
  }

  onSubmit() {
    const response = this.http.post<LoginResponseI>('api/users/verify', { token: this.token, session: this.session.session});
	this.authService.loginHandler(response);
  }

  ngOnDestroy() {
	setTimeout(() => {
		this.http.post<LoginResponseI>('api/users/verify', { token: null, session: this.session.session}).subscribe();
	});
  }

}
