import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard-service/dashboard-service';
import { RoomI } from 'src/app/model/room.interface';
import { ChatService } from '../../services/chat-service/chat.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss']
})
export class ConversationListComponent implements OnInit {
	isClicked = false;
	connected: boolean = true;

	rooms$: Observable<RoomI[]>= this.chatService.getMyRooms();
	rooms: RoomI[];

  constructor(public dashService: DashboardService, public chatService: ChatService, private authService: AuthService){ }

  ngOnInit() {
	  this.chatService.emitPaginateRooms();
	const storedData = localStorage.getItem('room');
		  if (storedData) {
			  const myData = JSON.parse(storedData);
			  this.chatService.joinRoom(myData);
		  }
}

	ngOnDestroy() {
		this.chatService.leaveRoom();
	}

  message(room: RoomI) {
	this.chatService.joinRoom(room.id);
  }

}
