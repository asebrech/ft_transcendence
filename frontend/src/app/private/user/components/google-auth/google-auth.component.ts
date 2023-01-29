import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.scss']
})
export class GoogleAuthComponent implements OnInit{

	qr: string;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<{qr:string}>('api/users/qr-code').subscribe(data => {
		console.log(data.qr);
      this.qr = data.qr;
    });
  }

  activate2FA() {
	this.http.get<{qr: string}>('api/users/qr-code').subscribe(data => {
		console.log(data.qr);
      this.qr = data.qr;
    });
  }

}
