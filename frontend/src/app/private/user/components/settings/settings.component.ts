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
		email: new FormControl(null, [Validators.required, Validators.email]),
		username: new FormControl(null, [Validators.required]),
		password: new FormControl(null, [Validators.required]),
		passwordConfirm: new FormControl(null, [Validators.required])
	},
		{ validators: CustomValidators.passwordsMatching }
	);

  email: string;

  constructor() { }

  ngOnInit(): void {
  }

}
