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
	hideMenu : boolean;
	menuShown : boolean = true;

	constructor(private router: Router, private auth : AuthService) 
	{
		this.isSmallScreen = window.matchMedia("(min-device-width: 320px) and (max-device-width: 480px)").matches;

		window.addEventListener("resize", () => 
		{
			this.isSmallScreen = window.matchMedia("(min-device-width: 320px) and (max-device-width: 480px)").matches;
			if (this.isSmallScreen == true)
			{
				this.hideMenu = false;
			}
			else
			{
				this.hideMenu = true;
			}				
		});
	}
	
	@ViewChild('menu__mobile_button', { static: false }) button!: ElementRef;
	
	ngAfterViewInit() 
	{
		this.button.nativeElement.addEventListener('click', () => 
		{
			this.button.nativeElement.classList.toggle('active');
			if (this.hideMenu == true)
				this.hideMenu = false;
			else if (this.hideMenu == false)
				this.hideMenu = true;
		})	
	}
	
	ngDoCheck() 
	{
		window.addEventListener("resize", () => {
			this.isSmallScreen = window.matchMedia("(min-device-width: 320px) and (max-device-width: 480px)").matches;
			if (this.isSmallScreen == true)
				this.hideMenu = false;
			else				
				this.hideMenu = true;
		});
	}

	ngOnInit() 
	{
		if (this.isSmallScreen == true)
		{
			this.hideMenu = false;
		}
		else
		{
			this.hideMenu = true;
		}
		this.currentUrl = this.router.url;
	}

	deconnection() {
		console.log('deco');
		localStorage.removeItem('access_token');
		location.reload();
	}
	
  }