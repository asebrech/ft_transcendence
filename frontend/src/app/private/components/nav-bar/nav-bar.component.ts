import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { UserService } from 'src/app/public/services/user-service/user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
	currentUrl: string;
  
	constructor(private router: Router, private auth : AuthService) {}
  
	ngOnInit() {
	  this.currentUrl = this.router.url;
	}

	deconnection() {
		console.log('deco');
		localStorage.removeItem('access_token');
		location.reload();
	}
  }