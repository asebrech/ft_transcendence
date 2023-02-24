import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { number } from 'yargs';

@Component({
	selector: 'app-chat-selector',
	templateUrl: './chat-selector.component.html',
	styleUrls: ['./chat-selector.component.scss']
})
export class ChatSelectorComponent {

	switchMenue: boolean = false;
	channel: boolean = false;


	constructor(private elementRef: ElementRef) { }

	switch() {
		this.channel ? this.channel = false : this.channel = true;
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
