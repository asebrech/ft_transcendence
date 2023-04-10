import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard-service/dashboard-service';
import { RoomI } from 'src/app/model/room.interface';
import { ChatService } from '../../services/chat-service/chat.service';
import { Observable } from 'rxjs';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss']
})
export class ConversationListComponent implements OnInit {
	selectedRoom: RoomI = {};
	isClicked = false;
	connected: boolean = true;

	rooms$: Observable<RoomI[]>= this.chatService.getMyRooms();
	rooms: RoomI[];

  constructor(public dashService: DashboardService, private chatService: ChatService, private authService: AuthService){ }

  ngOnInit() {
	  this.chatService.emitPaginateRooms(10, 0);
	const storedData = localStorage.getItem('room');
		  if (storedData) {
			  const myData = JSON.parse(storedData);
			  this.selectedRoom = myData;
			  this.chatService.joinRoom(this.selectedRoom);
		  }
}

	ngOnDestroy() {
		this.chatService.leaveRoom();
	}

  message(room: RoomI) {
	this.chatService.leaveRoom();
	this.chatService.joinRoom(room);
	localStorage.setItem('room', JSON.stringify(room));
	this.selectedRoom = room;
  }

}
