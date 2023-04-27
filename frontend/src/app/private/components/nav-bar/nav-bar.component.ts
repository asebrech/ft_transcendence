import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit 
{
	currentUrl: string;
	isSmallScreen: boolean;

	constructor(private router: Router, private auth : AuthService) 
	{
	}
	
	

	ngOnInit() 
	{
		this.currentUrl = this.router.url;
	}

	deconnection() 
	{
		localStorage.removeItem('access_token');
		location.reload();
	}
	
  }