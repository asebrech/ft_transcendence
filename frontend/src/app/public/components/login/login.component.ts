import { Component } from '@angular/core';
import { EmailValidator, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('testAnimation', [
      state('true', style({
        opacity: 1,
		'margin-top': 0
      })),
      state('false', style({
        opacity: 0,
		'margin-top': '-60px'
      })),
      transition('false => true', animate('300ms ease-in')),
      transition('true => false', animate('300ms ease-out'))
    ])]
})
export class LoginComponent {

	form: FormGroup = new FormGroup({
		email: new FormControl(null, [Validators.required, Validators.email]),
		password: new FormControl(null, [Validators.required])
	});
	mail: string;
	showPasswordField : boolean = false;

	constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

	login() {
		if (this.form.valid)
		this.authService.login({
			email: this.email.value,
			password: this.password.value
		}).pipe(
			tap(() => this.router.navigate(['../../private/chat/dashboard']))
		).subscribe()
	}

	get email(): FormControl {
		return this.form.get('email') as FormControl;
	}
	
	get password(): FormControl {
		return this.form.get('password') as FormControl;
	}

	checkEmail(mail: string) {
		this.http.get(`api/users/check-email?mail=${mail}`)
		.subscribe(res => {
			if (res) {
				// email exists, show password field
				this.showPasswordField = true;
			} else {
				// email does not exist, redirect to registration page
				this.router.navigate(['public/register']);
			}
		}
		);
	}
}