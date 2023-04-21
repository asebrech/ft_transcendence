import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.scss']
})
export class GoogleAuthComponent implements OnInit{

	qr: string;

  constructor(private http: HttpClient, private router : Router) { }

  ngOnInit() {
    this.http.get<{qr:string}>('api/users/qr-code').subscribe(data => {
      this.qr = data.qr;
    });
  }

  enable2FA() {
	this.http.get('api/users/enable-2fa').pipe(tap(() => {
		this.http.get<{qr: string}>('api/users/qr-code').subscribe(data => {
		  this.qr = data.qr;
		});
	})).subscribe();
  }

  disable2FA() {
	  this.qr = null;
	this.http.get('api/users/disable-2fa').subscribe();
  }

  goBack() {
	this.router.navigate(['/private/user/settings']);
  }

}
