import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.scss']
})
export class GoogleAuthComponent implements OnInit{

	qr: string;
  secret: string;
  token: string;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<{qr: string, secret: string}>('api/users/qr-code').subscribe(data => {
		console.log(data.qr);
      this.qr = data.qr;
      this.secret = data.secret;
    });
  }

  onSubmit() {
    // Get the secret key from local storage or some other secure storage
    // Send a POST request to the server to verify the token
    this.http.post('api/users/verify', { token: this.token, secret: this.secret }).subscribe(data => {
      if (data) {
        // Token is valid
        console.log('Token is valid');
      } else {
        // Token is invalid
        console.log('Token is invalid');
      }
    });
  }

}
