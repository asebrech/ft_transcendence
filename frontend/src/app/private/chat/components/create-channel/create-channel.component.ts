import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DashboardService } from '../../services/dashboard-service/dashboard-service';
import { ChatService } from '../../services/chat-service/chat.service';

@Component({
	selector: 'app-create-channel',
	templateUrl: './create-channel.component.html',
	styleUrls: ['./create-channel.component.scss']
})
export class CreateChannelComponent implements OnInit {

	channelForm: FormGroup;
	@ViewChild('name') monInput: ElementRef;

	constructor(private fb: FormBuilder, private dashService: DashboardService, private chatService: ChatService) { }

	ngOnInit() {
		this.channelForm = this.fb.group({
			name: ['', Validators.required],
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
		console.log(this.channelForm.getRawValue());
		this.chatService.createRoom(this.channelForm.getRawValue());
		this.dashService.create = false;
	}

}
