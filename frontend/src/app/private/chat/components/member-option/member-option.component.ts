import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat-service/chat.service';
import { UserI } from 'src/app/model/user.interface';

@Component({
	selector: 'app-member-option',
	templateUrl: './member-option.component.html',
	styleUrls: ['./member-option.component.scss']
})
export class MemberOptionComponent implements OnInit {

	@Output() valueChanged = new EventEmitter<boolean>();
	@Output() divHeight = new EventEmitter<number>();
	@Input() selectedUser: UserI;
	@ViewChild('maDiv') maDiv: ElementRef;

	isOwner: boolean = true;
	isAdmin: boolean = true;




	constructor(public chatService: ChatService) { }

	ngOnInit(): void {
		if (!this.chatService.selectedRoomOwner)
			this.isOwner = false;
		if (!this.chatService.selectedRoomAdmin)
			this.isAdmin = false;
	}

	ngAfterViewInit() {
		this.divHeight.emit(this.maDiv.nativeElement.offsetHeight);
	}

	onClick() {
		this.valueChanged.emit(false);
	}

	checkUser() {
		return (this.chatService.selectedRoomOwner || this.chatService.selectedRoomAdmin)
			&& this.selectedUser.id !== this.chatService.currentUser.id
			&& this.selectedUser.id !== this.chatService.selectedRoom.owner.id
	}

	checkUserOwnerOnly() {
		return this.chatService.selectedRoomOwner && this.selectedUser.id !== this.chatService.currentUser.id
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

	promote() {
		this.chatService.addAdmin(this.selectedUser);
	}
	
	kick() {
		this.chatService.quitRoom(this.selectedUser);
	}



}
