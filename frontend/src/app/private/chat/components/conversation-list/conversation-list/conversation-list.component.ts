import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard-service/dashboard-service';
import { RoomI } from 'src/app/model/room.interface';
import { ChatService } from '../../../services/chat-service/chat.service';
import { Observable } from 'rxjs';
import { UserI } from 'src/app/model/user.interface';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss']
})
export class ConversationListComponent implements OnInit {
	selectedUser: UserI;
	isClicked = false;
	connected: boolean = true;

	rooms$: Observable<RoomI[]>= this.chatService.getMyRooms();


  constructor(public dashService: DashboardService, private chatService: ChatService){ }

  ngOnInit() {
	this.chatService.emitPaginateRooms(10, 0);
}

	ngOnDestroy() {
		this.chatService.leaveRoom();
	}

  message(room: RoomI) {
	this.chatService.leaveRoom();
	this.chatService.joinRoom(room);
  }

}
