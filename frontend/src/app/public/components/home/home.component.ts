import { Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';
import { UserI } from 'src/app/model/user.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	user: UserI;

	constructor(private authService: AuthService) {}

	ngOnInit() {
		if (this.authService.isLoggedIn()) {
			this.user = this.authService.getLoggedInUser();
		}
		else {
			this.user = undefined;
		}
	}

	deconnection() {
		console.log('deco');
		localStorage.removeItem('access_token');
		location.reload();
	}
}
