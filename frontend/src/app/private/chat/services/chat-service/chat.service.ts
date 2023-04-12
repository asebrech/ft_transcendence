import { Injectable } from '@angular/core';
import { CustomSocket } from '../../sockets/custom-socket';
import { RoomI } from 'src/app/model/room.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, tap } from 'rxjs';
import { MessageI, MessagePaginatedI } from 'src/app/model/message.interface';
import { UserI } from 'src/app/model/user.interface';
import { DashboardService } from '../dashboard-service/dashboard-service';

@Injectable({
	providedIn: 'root'
})
export class ChatService {

	selectedRoom: RoomI = null;
	selectedRoomId: number = null;
	selectedRoomOwner: UserI = null;
	private roomName = new Subject<RoomI>();
	roomName$ = this.roomName.asObservable();
	private messages = new Subject<MessageI[]>();
	messages$ = this.messages.asObservable()

	constructor(private socket: CustomSocket, private snackbar: MatSnackBar, private dashService: DashboardService) { }

	getAddedMessage(): Observable<MessageI> {
		return this.socket.fromEvent<MessageI>('messageAdded');
	}

	sendMessage(message: MessageI) {
		return this.socket.emit('addMessage', message);
	}

	addUserToRoom(room: RoomI) {
		return this.socket.emit('addUserToRoom', room);
	}

	joinRoom(roomId: number) {
		return this.socket.emit('joinRoom', roomId);
	}

	leaveRoom() {
		return this.socket.emit('leaveRoom', this.selectedRoom);
	}

	quitRoom() {
		return this.socket.emit('quitRoom', this.selectedRoom);
	}

	getAllChannels(): Observable<RoomI[]> {
		return this.socket.fromEvent<RoomI[]>('getAllChannels');
	}

	getAddedMessages(): Observable<MessageI[]> {
		return this.socket.fromEvent<MessageI[]>('addedMessages').pipe(tap (value => {this.messages.next(value);}));
	}

	getMessages(): Observable<{messages: MessageI[], room: RoomI}> {
		return this.socket.fromEvent<{messages: MessageI[], room: RoomI}>('messages').pipe( tap(object => {
			if (object.room === null) {
				this.selectedRoom = object.room;
				this.selectedRoomId = null;
				this.selectedRoomOwner = null;
				this.roomName.next(object.room);
				this.messages.next(object.messages);
				localStorage.removeItem('room');
			}
			else {
				this.selectedRoom = object.room;
				this.selectedRoomId = this.selectedRoom.id;
				this.selectedRoomOwner = this.selectedRoom.owner;
				this.roomName.next(object.room);
				this.messages.next(object.messages);
				localStorage.setItem('room', JSON.stringify(object.room.id));
			}
			if (this.dashService.members)
				this.listMember();
		}));
	}

	getMyRooms(): Observable<RoomI[]> {
		return this.socket.fromEvent<RoomI[]>('rooms');
	}

	getSelectedRoom(): Observable<RoomI> {
		return this.socket.fromEvent<RoomI>('selectedRoom').pipe(tap((room) => {
			this.roomName.next(room);
		}));
	}

	emitPaginateRooms() {
		this.socket.emit('paginateRooms');
	}

	createRoom(room: RoomI) {
		this.socket.emit('createRoom', room);
		this.snackbar.open(`User ${room.name} created successfuly`, 'Close', {
			duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
		});
	}

	changeName(name: string, room: RoomI) {
		this.socket.emit('changeName', { name, room });
	}

	listUsers() {
		return this.socket.emit('listUsers', this.selectedRoom);
	}

	listMember() {
		return this.socket.emit('listMember', this.selectedRoom);
	}

	listAllChannels() {
		return this.socket.emit('listAllChannels');
	}

	getUsers(): Observable<UserI[]> {
		return this.socket.fromEvent<UserI[]>('getUsers');
	}

	getMember(): Observable<UserI[]> {
		return this.socket.fromEvent<UserI[]>('getMember');
	}

	addUsers(users: UserI[]) {
		this.socket.emit('addUsers', { users: users, room: this.selectedRoom });
	}
}
