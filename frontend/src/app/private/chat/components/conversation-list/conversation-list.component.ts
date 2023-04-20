import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard-service/dashboard-service';
import { RoomI } from 'src/app/model/room.interface';
import { ChatService } from '../../services/chat-service/chat.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { UserI } from 'src/app/model/user.interface';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss']
})
export class ConversationListComponent implements OnInit {
	isClicked = false;

	rooms$: Observable<RoomI[]>= this.chatService.getMyRooms();
	rooms: RoomI[] = [];
	currentUser: UserI = this.authService.getLoggedInUser();

  constructor(public dashService: DashboardService, public chatService: ChatService, private authService: AuthService){ }

  ngOnInit() {
	  this.chatService.getConnected().subscribe(users => {
		for (const room of this.rooms) {
			if (room.privateMessage) {
				for (const user of users) {
					for (const roomUser of room.users) {
						if (roomUser.id !== this.currentUser.id && roomUser.id === user.id) {
							room.isConnected = true;
						}
					}
				}
			}
		}
	})
	this.chatService.emitPaginateRooms();
	this.rooms$.subscribe(val =>{ this.rooms = val;
		for (let i = 0; i < this.rooms.length; i++) {
			this.rooms[i].isConnected = false;
		}
		this.chatService.connected();
	});
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
