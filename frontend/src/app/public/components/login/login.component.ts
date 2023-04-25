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
  
	  constructor(private authService: AuthService, private router: Router, private http: HttpClient, private user: UserService) {}
  
	  ngOnInit() {
		  // add event listener to reset password field and hide it when email changes
		  this.form.get('email').valueChanges.subscribe(() => {
			  this.form.get('password').reset();
			  this.showPasswordField = false;
		  });
	  }
  
	  login() {
		  if (this.form.valid)
		  this.authService.login({
			  email: this.email.value,
			  password: this.password.value
		  });
	  }
  
	  get email(): FormControl {
		  return this.form.get('email') as FormControl;
	  }
  
	  get password(): FormControl {
		  return this.form.get('password') as FormControl;
	  }
  
	  checkEmail() {
		  if (this.form.get('email').valid) {
			  this.user.mail = this.form.get('email').value;
			  this.http.get(`api/users/check-email?mail=${this.user.mail}`)
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
		  }else {
			  // email is not valid, reset password field and hide it
			  this.form.get('password').reset();
			  this.showPasswordField = false;
		  }
	  }
  }