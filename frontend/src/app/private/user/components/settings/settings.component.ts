import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/public/_helpers/custom-validators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  form: FormGroup = new FormGroup ({
		newEmail: new FormControl(null, [Validators.required, Validators.email]),
		username: new FormControl(null, [Validators.required]),
    newPassword: new FormControl(null, [Validators.required]),
    oldPasswordConfirm: new FormControl(null, [Validators.required]),
		newPasswordConfirm: new FormControl(null, [Validators.required])
	},
		{ validators: CustomValidators.passwordsMatching }
	);
  email: string;
  usernamePopup: boolean = false;
  pwdPopup: boolean = false;
  emailPopup: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  changeUsername() {
    this.usernamePopup = true;
  }
  changePwd() {
    this.pwdPopup = true;
  }
  changeEmail() {
    this.emailPopup = true;
  }
  closePopup(num : number) {
    if (num == 0)
      this.emailPopup = false;
    else if (num == 1)
      this.pwdPopup = false;
    else
      this.usernamePopup = false;
  }
}
