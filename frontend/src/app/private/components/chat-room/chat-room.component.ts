import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MessagePaginatedI } from 'src/app/model/message.interface';
import { RoomI } from 'src/app/model/room.interface';
import { ChatService } from '../../services/chat-service/chat.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, OnChanges, OnDestroy {

	@Input() chatRoom: RoomI;

	messages$: Observable<MessagePaginatedI> = this.chatService.getMessages().pipe(
		map((messagePaginated: MessagePaginatedI) => {
			const items = messagePaginated.items.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
			messagePaginated.items = items;
			return messagePaginated;
		})
	);

	chatMessage: FormControl = new FormControl(null, [Validators.required])

	constructor(private chatService: ChatService) {}

	ngOnInit(): void {
	}

	ngOnChanges(changes: SimpleChanges) {
		this.chatService.leaveRoom(changes['chatRoom'].previousValue)
		if (this.chatRoom) { 
			this.chatService.joinRoom(this.chatRoom);
		}
	}

	ngOnDestroy(): void {
		this.chatService.leaveRoom(this.chatRoom);
	}

	sendMessage() {
		this.chatService.sendMessage({text: this.chatMessage.value, room: this.chatRoom});
		this.chatMessage.reset();
	}
}
