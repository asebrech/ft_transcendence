import { Injectable } from '@angular/core';
import { CustomSocket } from '../../sockets/custom-socket';
import { RoomI } from 'src/app/model/room.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, tap } from 'rxjs';
import { MessageI, MessagePaginatedI } from 'src/app/model/message.interface';
import { UserI } from 'src/app/model/user.interface';
import { DashboardService } from '../dashboard-service/dashboard-service';
import { BlockedUser } from 'src/app/model/blockedUser.interface';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class ChatService {

	currentUser: UserI = null;
	selectedRoom: RoomI = null;
	selectedRoomId: number = null;
	selectedRoomOwner: boolean = false;
	selectedRoomAdmin: boolean = false;
	private roomName = new Subject<RoomI>();
	roomName$ = this.roomName.asObservable();
	private messages = new Subject<MessageI[]>();
	messages$ = this.messages.asObservable()
	roomToCheck: RoomI = null;

	constructor(private socket: CustomSocket, private snackbar: MatSnackBar, private dashService: DashboardService, private route: Router) { }

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

	quitRoom(user: UserI) {
		const room: RoomI = this.selectedRoom;
		return this.socket.emit('quitRoom', {room, user});
	}

	banFromRoom(object: {baned: BlockedUser, user: UserI}) {
		const room: RoomI = this.selectedRoom;
		return this.socket.emit('banFromRoom', {room, baned: {id: object.baned.id, date: object.baned.date}, user: object.user});
	}

	getAllChannels(): Observable<any[]> {
		return this.socket.fromEvent<any[]>('getAllChannels');
	}

	getAddedMessages(): Observable<MessageI[]> {
		return this.socket.fromEvent<MessageI[]>('addedMessages').pipe(tap (value => {this.messages.next(value);}));
	}

	getMessages(): Observable<{messages: MessageI[], room: RoomI, user: UserI}> {
		return this.socket.fromEvent<{messages: MessageI[], room: RoomI, user: UserI}>('messages').pipe( tap(object => {
			if (object.room === null) {
				this.selectedRoom = object.room;
				this.selectedRoomId = null;
				this.currentUser = null;
				this.selectedRoomOwner = false;
				this.selectedRoomAdmin = false;
				this.roomName.next(object.room);
				this.messages.next(object.messages);
				localStorage.removeItem('room');
			}
			else {
				this.selectedRoom = object.room;
				this.selectedRoomId = this.selectedRoom.id;
				this.currentUser = object.user;
				if (this.selectedRoom.owner && this.selectedRoom.owner.id === object.user.id)
					this.selectedRoomOwner = true;
				else
					this.selectedRoomOwner = false;
				if (this.selectedRoom.admins && this.selectedRoom.admins.find(toto => toto.id === object.user.id))
					this.selectedRoomAdmin = true;
				else
					this.selectedRoomAdmin = false;
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
		// this.snackbar.open(`User ${room.name} created successfuly`, 'Close', {
		// 	duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
		// });
	}

	async joinAndRpivateMessage(user: UserI) {
		await this.route.navigate(['/private/chat/dashboard']);
		localStorage.removeItem('room');
		this.socket.emit('privateMessage', user);
	}

	privateMessage(user: UserI) {
		this.socket.emit('privateMessage', user);
	}

	deleteRoom() {
		this.socket.emit('deleteRoom', this.selectedRoom);
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

	addAdmin(user: UserI) {
		this.socket.emit('addAdmin', { user: user, room: this.selectedRoom });
	}

	removeAdmin(user: UserI) {
		this.socket.emit('removeAdmin', { user: user, room: this.selectedRoom });
	}

	addMuted(muted: BlockedUser) {
		this.socket.emit('addMuted', { muted: muted, room: this.selectedRoom });
	}

	removeMuted(user: UserI) {
		this.socket.emit('removeMuted', { user: user, room: this.selectedRoom });
	}

	blockUser(user: UserI, room: RoomI) {
		this.socket.emit('blockUser', { user: user, room: room });
	}

	unBlockUser(user: UserI, room: RoomI) {
		this.socket.emit('unBlockUser', { user: user, room: room});
	}

	checkIfBlocked(user: UserI) {
		this.socket.emit('checkIfBlocked', user);
	}

	getIfBlocked(): Observable<boolean> {
		return this.socket.fromEvent<boolean>('isBlocked');
	}

	checkPass(pass: string){
		const room: RoomI = this.roomToCheck
		this.socket.emit('checkPass', {pass, room});
	}

	getIfCheckPass(): Observable<RoomI> {
		return this.socket.fromEvent<RoomI>('checkPass');
	}

	getConfirmPass(): Observable<boolean> {
		return this.socket.fromEvent<boolean>('confirmPass');
	}

	changePass(pass: string){
		const room: RoomI = this.selectedRoom
		this.socket.emit('changePass', {pass, room});
	}

	removePass(){
		const room: RoomI = this.selectedRoom
		this.socket.emit('removePass', this.selectedRoom);
	}

	checkBlocked() {
		this.socket.emit('checkBlocked', this.selectedRoom);
	}
}
