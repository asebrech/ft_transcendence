import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { AuthService } from '../../services/auth-service/auth.service';
import { ActivatedRoute, Route } from '@angular/router';
import { LoginResponseI } from 'src/app/model/login-response';

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.scss']
})
export class GoogleAuthComponent implements OnInit {;

	session: any;
	token: string;

  constructor(private http: HttpClient, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
	this.session = this.route.snapshot.queryParams;
  }

  onSubmit() {
    // Get the secret key from local storage or some other secure storage
    // Send a POST request to the server to verify the token
	console.log(this.token);
    const response = this.http.post<LoginResponseI>('api/users/verify', { token: this.token, session: this.session.session});
	this.authService.loginHandler(response);
  }

}
