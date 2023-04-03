import { Injectable } from '@angular/core';
import { CustomSocket } from '../../sockets/custom-socket';
import { RoomI, RoomPaginateI } from 'src/app/model/room.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, tap } from 'rxjs';
import { MessageI, MessagePaginatedI } from 'src/app/model/message.interface';
import { UserI } from 'src/app/model/user.interface';

@Injectable({
	providedIn: 'root'
})
export class ChatService {

	selectedRoom: RoomI = null;

	constructor(private socket: CustomSocket, private snackbar: MatSnackBar) { }

	getAddedMessage(): Observable<MessageI> {
		return this.socket.fromEvent<MessageI>('messageAdded');
	}

	sendMessage(message: MessageI) {
		return this.socket.emit('addMessage', message);
	}

	joinRoom(room: RoomI) {
		this.selectedRoom = room;
		return this.socket.emit('joinRoom', room);
	}

	leaveRoom() {
		return this.socket.emit('leaveRoom', this.selectedRoom);
	}

	getMessages(): Observable<MessageI[]> {
		return this.socket.fromEvent<MessageI[]>('messages');
	}

	getMyRooms(): Observable<RoomI[]> {
		return this.socket.fromEvent<RoomI[]>('rooms');
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

	addUsers(users: UserI[]) {
		this.socket.emit('addUsers', {users: users, room: this.selectedRoom});
	}

}
