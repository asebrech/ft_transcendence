import { Component } from '@angular/core';
import {Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';
import { UserI } from 'src/app/model/user.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
 
	user: UserI = this.authService.getLoggedInUser();

	constructor(private authService: AuthService) {}

}
