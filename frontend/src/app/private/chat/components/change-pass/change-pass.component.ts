import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DashboardService } from '../../services/dashboard-service/dashboard-service';
import { ChatService } from '../../services/chat-service/chat.service';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss']
})
export class ChangePassComponent implements OnInit {

	passForm: FormGroup;

	constructor(private fb: FormBuilder, private dashService: DashboardService, private chatService: ChatService) { }

	ngOnInit() {
		this.passForm = this.fb.group({
			channelPassword: [''],
			confirmPassword: ['']
		}, {
			validators: this.passwordMatchValidator()
		});
	}

	passwordMatchValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const password = control.get('channelPassword').value;
			const confirmPassword = control.get('confirmPassword').value;
			if ((!password || ! confirmPassword)) {
				return { passwordMismatch: true };
			}
			else {
				return password === confirmPassword ? null : { passwordMismatch: true };
			}
			return null;
		};
	}


	onSubmit() {
		const pass = this.passForm.getRawValue();
		this.chatService.changePass(pass.channelPassword);
		this.dashService.changePass = false;
	}
}
