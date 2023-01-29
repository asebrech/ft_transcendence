import { Injectable } from '@angular/core';
import { CustomSocket } from '../../sockets/custom-socket';
import { RoomI, RoomPaginateI } from 'src/app/model/room.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, tap } from 'rxjs';
import { MessageI, MessagePaginatedI } from 'src/app/model/message.interface';

@Injectable({
	providedIn: 'root'
})
export class ChatService {

	constructor(private socket: CustomSocket, private snackbar: MatSnackBar) { }

	getAddedMessage(): Observable<MessageI> {
		return this.socket.fromEvent<MessageI>('messageAdded');
	}

	sendMessage(message: MessageI) {
		return this.socket.emit('addMessage', message);
	}

	joinRoom(room: RoomI) {
		return this.socket.emit('joinRoom', room);
	}

	leaveRoom(room: RoomI) {
		return this.socket.emit('leaveRoom', room);
	}

	getMessages(): Observable<MessagePaginatedI> {
		return this.socket.fromEvent<MessagePaginatedI>('messages');
	}

	getMyRooms(): Observable<RoomPaginateI> {
		return this.socket.fromEvent<RoomPaginateI>('rooms');
	}

	emitPaginateRooms(limit: number, page: number) {
		this.socket.emit('paginateRooms', { limit, page });
	}

	createRoom(room: RoomI) {
		this.socket.emit('createRoom', room);
		this.snackbar.open(`User ${room.name} created successfuly`, 'Close', {
			duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
		});
	}

}
