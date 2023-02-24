import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { ChatService } from '../../../services/chat-service/chat.service';
import { DashboardService } from '../../../services/dashboard-service/dashboard-service';

@Component({
	selector: 'app-chat-selector',
	templateUrl: './chat-selector.component.html',
	styleUrls: ['./chat-selector.component.scss']
})
export class ChatSelectorComponent {

	switchMenue: boolean = false;
	imagePath1 = "../../../../../../assets/images/close.png";
	imagePath2 = "../../../../../../assets/images/arrow-down-sign-to-navigate.png";

	constructor(private elementRef: ElementRef, public dashService: DashboardService) { }

	switch() {
		this.dashService.channel = !this.dashService.channel;
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
}
