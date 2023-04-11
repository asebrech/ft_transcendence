import { Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import console from 'console';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/service/auth.service';
import { ConnectedUserI } from 'src/chat/model/connected-user/connected-user.interface';
import { JoinedRoomI } from 'src/chat/model/joined-room/joined-room.interface';
import { MessageI } from 'src/chat/model/message/message.interface';
import { PageI } from 'src/chat/model/page.interface';
import { RoomI } from 'src/chat/model/room/room.interface';
import { ConnectedUserService } from 'src/chat/service/connected-user/connected-user.service';
import { JoinedRoomService } from 'src/chat/service/joined-room/joined-room.service';
import { MessageService } from 'src/chat/service/message/message.service';
import { RoomService } from 'src/chat/service/room-service/room.service';
import { UserI } from 'src/user/model/user.interface';
import { UserService } from 'src/user/service/user-service/user.service';

@WebSocketGateway({ cors: { origin: ['https://hoppscotch.io', 'http://localhost:3000', 'http://localhost:4200'] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {

	@WebSocketServer()
	server: Server;

	constructor(private authService: AuthService,
		private userService: UserService,
		private roomService: RoomService,
		private connectedUserService: ConnectedUserService,
		private joinedRoomService: JoinedRoomService,
		private messageService: MessageService) { };

	async onModuleInit() {
		await this.connectedUserService.deleteAll();
		await this.joinedRoomService.deleteAll();
	}

	async handleConnection(socket: Socket) {
		try {
			const decodedToken = await this.authService.verifyJwt(socket.handshake.headers.authorization);
			const user: UserI = await this.userService.getOne(decodedToken.user.id);
			if (!user) {
				return this.disconnect(socket);
			} else {
				socket.data.user = user;
				await this.connectedUserService.create({ socketId: socket.id, user });
			}
		} catch {
			return this.disconnect(socket);
		}
	}

	async handleDisconnect(socket: Socket) {
		//remove connection from DB
		await this.connectedUserService.deleteBySocketId(socket.id);
		socket.disconnect();
	}

	private disconnect(socket: Socket) {
		socket.emit('Error', new UnauthorizedException());
		socket.disconnect();
	}

	@SubscribeMessage('createRoom')
	async onCreateRoom(socket: Socket, room: RoomI) {
		const createdRoom: RoomI = await this.roomService.createRoom(room, socket.data.user);

		for (const user of createdRoom.users) {
			const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
			const rooms = await this.roomService.getRoomsForUser(user.id);
			for (const connection of connections) {
				await this.server.to(connection.socketId).emit('rooms', rooms);
			}
		}
	}


	@SubscribeMessage('changeName')
	async changeName(socket: Socket, object: { name: string, room: RoomI }) {
		const room: RoomI = await this.roomService.chaneNameRoom(object.name, object.room);

		for (const user of room.users) {
			const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
			const rooms = await this.roomService.getRoomsForUser(user.id);
			for (const connection of connections) {
				await this.server.to(connection.socketId).emit('rooms', rooms);
			}
		}
		const joinedUsers: JoinedRoomI[] = await this.joinedRoomService.findByRoom(room.id);
		for (const user of joinedUsers) {
			await this.server.to(user.socketId).emit('selectedRoom', room);
		}
	}

	@SubscribeMessage('listAllChannels')
	async listAllChannels(socket: Socket) {
		const rooms: RoomI[] = await this.roomService.getAllRoom();
		return this.server.to(socket.id).emit('getAllChannels', rooms);
	}


	@SubscribeMessage('listUsers')
	async listUsers(socket: Socket, room: RoomI) {
		let users: UserI[] = await this.userService.findAll();
		const updatedRoom = await this.roomService.getRoom(room.id);
		for (const user of updatedRoom.users) {
			const index = users.findIndex(toto => toto.id === user.id)
			if (index > -1) {
				users.splice(index, 1);
			}
		}
		return this.server.to(socket.id).emit('getUsers', users);
	}

	@SubscribeMessage('listMember')
	async listMember(socket: Socket, room: RoomI) {
		const updatedRoom = await this.roomService.getRoom(room.id);
		return this.server.to(socket.id).emit('getMember', updatedRoom.users);
	}

	@SubscribeMessage('addUsers')
	async addUsers(socket: Socket, object: { users: UserI[], room: RoomI }) {

		const addUsersRoom: RoomI = await this.roomService.addUsersToRoom(object.room, object.users);

		for (const user of addUsersRoom.users) {
			const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
			const rooms = await this.roomService.getRoomsForUser(user.id);
			for (const connection of connections) {
				await this.server.to(connection.socketId).emit('rooms', rooms);
			}
		}
	}

	@SubscribeMessage('paginateRooms')
	async onPaginatieRoom(socket: Socket) {
		const rooms = await this.roomService.getRoomsForUser(socket.data.user.id);
		return this.server.to(socket.id).emit('rooms', rooms);
	}

	@SubscribeMessage('addUserToRoom')
	async addUserToRoom(socket: Socket, room: RoomI) {

		let users: UserI[] = [];
		users.push(socket.data.user);
		const upRoom = await this.roomService.getRoom(room.id);

		if (upRoom.users.find(user => user.id === socket.data.user.id)) {
			this.onJoinRoom(socket, room.id);
		}
		else {
			const addUsersRoom: RoomI = await this.roomService.addUsersToRoom(upRoom, users);
	
			for (const user of addUsersRoom.users) {
				const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
				const rooms = await this.roomService.getRoomsForUser(user.id);
				for (const connection of connections) {
					await this.server.to(connection.socketId).emit('rooms', rooms);
				}
			}
			this.onJoinRoom(socket, room.id);
		}

	}

	@SubscribeMessage('joinRoom')
	async onJoinRoom(socket: Socket, roomId: number) {
		this.onLeaveRoom(socket);
		const updatedRoom: RoomI = await this.roomService.getRoom(roomId);
		const rooms: RoomI[] = await this.roomService.getRoomsForUser(socket.data.user.id)
		if (updatedRoom == null || !rooms.find(toto => toto.id === updatedRoom.id))
			return;
		const messages = await this.messageService.findMessagesForRoom(updatedRoom);
		await this.joinedRoomService.create({ socketId: socket.id, user: socket.data.user, room: updatedRoom});
		await this.server.to(socket.id).emit('messages', {messages: messages, room: updatedRoom});
	}

	@SubscribeMessage('leaveRoom')
	async onLeaveRoom(socket: Socket) {
		await this.joinedRoomService.deleteBySocketId(socket.id);
	}

	@SubscribeMessage('addMessage')
	async onAddMessage(socket: Socket, message: MessageI) {
		const createdMessage: MessageI = await this.messageService.create({ ...message, user: socket.data.user });
		const room: RoomI = await this.roomService.getRoom(createdMessage.room.id);
		const messages = await this.messageService.findMessagesForRoom(room);
		const joinedUsers: JoinedRoomI[] = await this.joinedRoomService.findByRoom(room.id);
		for (const user of joinedUsers) {
			await this.server.to(user.socketId).emit('messages', {messages: messages, room: room});
		}
	}

}
