import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard-service/dashboard-service';
import { ChatService } from '../../services/chat-service/chat.service';

@Component({
  selector: 'app-channel-option',
  templateUrl: './channel-option.component.html',
  styleUrls: ['./channel-option.component.scss']
})
export class ChannelOptionComponent {

	switchMenue: boolean = false;
	imagePath1 = "../../../../../../assets/images/close.png";
	imagePath2 = "../../../../../../assets/images/arrow-down-sign-to-navigate.png";

	constructor(private elementRef: ElementRef, public dashService: DashboardService, public chatService: ChatService) { }

	switch() {
		this.hideSwitch();
	}

	showSwitch() {
		this.switchMenue = true;
	}

	hideSwitch() {
		this.switchMenue = false;
	}

	@HostListener('document:click', ['$event'])
	onClick(event: MouseEvent) {
		if (!this.switchMenue && this.elementRef.nativeElement.querySelector('.arrow').contains(event.target)) {
			this.showSwitch();
		}
		else if (this.switchMenue && !this.elementRef.nativeElement.querySelector('.switch').contains(event.target)) {
			this.hideSwitch();
		}
	}

	changePass() {
		console.log('changePass');
	}

	leaveChannel() {
		console.log('leaveChannel');
	}

	deleteChannel() {
		console.log('deleteChannel');
	}
}
