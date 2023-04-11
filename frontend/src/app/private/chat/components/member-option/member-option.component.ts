import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat-service/chat.service';

@Component({
  selector: 'app-member-option',
  templateUrl: './member-option.component.html',
  styleUrls: ['./member-option.component.scss']
})
export class MemberOptionComponent implements OnInit {

	@Output() valueChanged = new EventEmitter<boolean>();
	@Output() divHeight = new EventEmitter<number>();
	@ViewChild('maDiv') maDiv: ElementRef;

	isAdmin: boolean = true;


  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
	if (this.chatService.selectedRoomOwner === null)
		this.isAdmin = false;
}

ngAfterViewInit() {
	  this.divHeight.emit(this.maDiv.nativeElement.offsetHeight);
  }

  onClick() {
	this.valueChanged.emit(false);
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
