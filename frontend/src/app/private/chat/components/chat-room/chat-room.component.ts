import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { Observable, combineLatest, map, startWith, tap } from 'rxjs';
import { MessagePaginatedI } from 'src/app/model/message.interface';
import { RoomI } from 'src/app/model/room.interface';
import { ChatService } from '../../services/chat-service/chat.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnChanges, OnDestroy, AfterViewInit{

	@Input() chatRoom: RoomI;
    @ViewChild('messages') private messagesScroller: ElementRef;

	messagesPaginate$: Observable<MessagePaginatedI> = combineLatest([this.chatService.getMessages(), this.chatService.getAddedMessage().pipe(startWith(null))]).pipe(
		map(([messagePaginated, message]) => {
			if (message && message.room.id === this.chatRoom.id && ! messagePaginated.items.some(m => m.id === message.id)) {
				messagePaginated.items.push(message);
			}
			const items = messagePaginated.items.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
			messagePaginated.items = items;
			return messagePaginated;
		}),
		tap(() => this.scrollToBottom())
	)

	chatMessage: FormControl = new FormControl(null, [Validators.required])

	constructor(private chatService: ChatService) {}

	ngOnChanges(changes: SimpleChanges) {
		this.chatService.leaveRoom(changes['chatRoom'].previousValue)
		if (this.chatRoom) { 
			this.chatService.joinRoom(this.chatRoom);
		}
	}

	ngAfterViewInit(): void {
		this.scrollToBottom(); 
	}


	ngOnDestroy(): void {
		this.chatService.leaveRoom(this.chatRoom);
	}

	sendMessage() {
		this.chatService.sendMessage({text: this.chatMessage.value, room: this.chatRoom});
		this.chatMessage.reset();
	}

	scrollToBottom(): void {
        setTimeout(() => {this.messagesScroller.nativeElement.scrollTop = this.messagesScroller  .nativeElement.scrollHeight}, 1);    
    }
}
