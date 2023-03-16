import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard-service/dashboard-service';

@Component({
	selector: 'app-create-channel',
	templateUrl: './create-channel.component.html',
	styleUrls: ['./create-channel.component.scss']
})
export class CreateChannelComponent implements OnInit {

	channelForm: FormGroup;
	@ViewChild('channelName') monInput: ElementRef;

	constructor(private fb: FormBuilder, private dashService: DashboardService) { }

	ngOnInit() {
		this.channelForm = this.fb.group({
			channelName: ['', Validators.required],
			isPrivate: [false],
			hasPass: [false],
			channelPassword: [''],
			confirmPassword: ['']
		}, {
			validators: this.passwordMatchValidator()
		});
	}
	
	ngAfterViewInit() {
		this.monInput.nativeElement.focus();
	  }

	passwordMatchValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const password = control.get('channelPassword').value;
			const confirmPassword = control.get('confirmPassword').value;
			const hasPass = control.get('hasPass').value;
			if (hasPass && (!password || ! confirmPassword)) {
				return { passwordMismatch: true };
			}
			else if (hasPass) {
				return password === confirmPassword ? null : { passwordMismatch: true };
			}
			return null;
		};
	}


	onSubmit() {
		const channel = {
			name: this.channelForm.get('channelName').value,
			isPrivate: this.channelForm.get('isPrivate').value,
			hasPass: this.channelForm.get('hasPass').value,
			password: this.channelForm.get('channelPassword').value
		};

		console.log(channel);
		this.dashService.create = false;
	}

}
