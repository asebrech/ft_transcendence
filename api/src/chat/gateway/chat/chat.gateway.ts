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
		this.onJoinRoom(socket, createdRoom.id);
	}


	@SubscribeMessage('changeName')
	async changeName(socket: Socket, object: { name: string, room: RoomI }) {
		// if (socket.data.user.id !== object.room.owner.id) {
		// 	return socket.emit('Error', new UnauthorizedException());
		// }
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
		const rooms: any[] = await this.roomService.getAllRoom();
		const users: any[] = await this.userService.findAll();
		const checkedRooms = rooms;
		for (const room of rooms) {
			const banned = room.baned.find(toto => toto.id === socket.data.user.id)
			if (banned) {
				const index = checkedRooms.findIndex(toto => toto.id === room.id)
				if (index !== -1) {
					checkedRooms.splice(index, 1);
				}
			}
		}
		const index = users.findIndex(obj => obj.id === socket.data.user.id);
		if (index !== -1)
			  users.splice(index, 1);
		for (const user of users) {
			user.name = user.username;
		}
		const merged = [...rooms, ...users];
		merged.sort((a, b) => {
			const nameA = a.name.toLowerCase();
			const nameB = b.name.toLowerCase();
		  
			if (nameA < nameB) {
			  return -1;
			} else if (nameA > nameB) {
			  return 1;
			} else {
			  return 0;
			}
		  });
		return this.server.to(socket.id).emit('getAllChannels', merged);
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
		if (!room)
			return this.server.to(socket.id).emit('getMember', null);
		const updatedRoom = await this.roomService.getRoom(room.id);
		return this.server.to(socket.id).emit('getMember', updatedRoom.users);
	}

	@SubscribeMessage('addUsers')
	async addUsers(socket: Socket, object: { users: UserI[], room: RoomI }) {
		// if (socket.data.user.id !== object.room.owner.id) {
		// 	return socket.emit('Error', new UnauthorizedException());
		// }
		object.room = await this.roomService.getRoom(object.room.id);
		for (const user of object.users) {
			if (object.room.baned.find(toto => toto.id === user.id)) {
				const index = object.room.baned.findIndex(obj => obj.id === user.id);
				if (index !== -1)
  					object.room.baned.splice(index, 1);
			}
		}
		const addUsersRoom: RoomI = await this.roomService.addUsersToRoom(object.room, object.users);
		const joinedUsers: JoinedRoomI[] = await this.joinedRoomService.findByRoom(addUsersRoom.id);

		for (const user of addUsersRoom.users) {
			const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
			const rooms = await this.roomService.getRoomsForUser(user.id);
			for (const connection of connections) {
				await this.server.to(connection.socketId).emit('rooms', rooms);
				if (joinedUsers.find(toto => toto.socketId === connection.socketId))
					await this.server.to(connection.socketId).emit('getMember', addUsersRoom.users);
			}
		}
	}

	@SubscribeMessage('addAdmin')
	async addAdmin(socket: Socket, object: { user: UserI, room: RoomI }) {
		// if (socket.data.user.id !== object.room.owner.id) {
		// 	return socket.emit('Error', new UnauthorizedException());
		// }
		object.room = await this.roomService.getRoom(object.room.id);
		const addAdminRoom: RoomI = await this.roomService.addAdminToRoom(object.room, object.user);
		const joined: JoinedRoomI[] = await this.joinedRoomService.findByRoom(addAdminRoom.id);
		const messages = await this.messageService.findMessagesForRoom(addAdminRoom);
		for (const user of addAdminRoom.users)
		{
			const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
			for (const connection of connections) {
				if (joined.find(toto => toto.socketId === connection.socketId)) {
						await this.server.to(connection.socketId).emit('messages', { messages: messages, room: addAdminRoom, user: user});
					}
			}
		}
	}

	@SubscribeMessage('removeAdmin')
	async removeAdmin(socket: Socket, object: { user: UserI, room: RoomI }) {
		// if (socket.data.user.id !== object.room.owner.id) {
		// 	return socket.emit('Error', new UnauthorizedException());
		// }
		object.room = await this.roomService.getRoom(object.room.id);
		const addAdminRoom: RoomI = await this.roomService.removeAdminToRoom(object.room, object.user);
		const joined: JoinedRoomI[] = await this.joinedRoomService.findByRoom(addAdminRoom.id);
		const messages = await this.messageService.findMessagesForRoom(addAdminRoom);
		for (const user of addAdminRoom.users)
		{
			const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
			for (const connection of connections) {
				if (joined.find(toto => toto.socketId === connection.socketId)) {
						await this.server.to(connection.socketId).emit('messages', { messages: messages, room: addAdminRoom, user: user});
					}
			}
		}
	}

	@SubscribeMessage('addMuted')
	async addMuted(socket: Socket, object: { user: UserI, room: RoomI }) {
		// if (socket.data.user.id !== object.room.owner.id) {
		// 	return socket.emit('Error', new UnauthorizedException());
		// }
		object.room = await this.roomService.getRoom(object.room.id);
		const addAdminRoom: RoomI = await this.roomService.addMutedToRoom(object.room, object.user);
		const joined: JoinedRoomI[] = await this.joinedRoomService.findByRoom(addAdminRoom.id);
		const messages = await this.messageService.findMessagesForRoom(addAdminRoom);
		for (const user of addAdminRoom.users)
		{
			const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
			for (const connection of connections) {
				if (joined.find(toto => toto.socketId === connection.socketId)) {
						await this.server.to(connection.socketId).emit('messages', { messages: messages, room: addAdminRoom, user: user});
					}
			}
		}
	}

	@SubscribeMessage('removeMuted')
	async removeMuted(socket: Socket, object: { user: UserI, room: RoomI }) {
		// if (socket.data.user.id !== object.room.owner.id) {
		// 	return socket.emit('Error', new UnauthorizedException());
		// }
		object.room = await this.roomService.getRoom(object.room.id);
		const addAdminRoom: RoomI = await this.roomService.removeMutedToRoom(object.room, object.user);
		const joined: JoinedRoomI[] = await this.joinedRoomService.findByRoom(addAdminRoom.id);
		const messages = await this.messageService.findMessagesForRoom(addAdminRoom);
		for (const user of addAdminRoom.users)
		{
			const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
			for (const connection of connections) {
				if (joined.find(toto => toto.socketId === connection.socketId)) {
						await this.server.to(connection.socketId).emit('messages', { messages: messages, room: addAdminRoom, user: user});
					}
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

		const upRoom = await this.roomService.getRoom(room.id);

		if (upRoom.baned.find(toto => toto.id === socket.data.user.id))
			return socket.emit('Error', new UnauthorizedException());

		if (upRoom.users.find(user => user.id === socket.data.user.id)) {
			this.onJoinRoom(socket, room.id);
		}
		else {
			let users: UserI[] = [];
			users.push(socket.data.user);
			const addUsersRoom: RoomI = await this.roomService.addUsersToRoom(upRoom, users);
			const joinedUsers: JoinedRoomI[] = await this.joinedRoomService.findByRoom(addUsersRoom.id);

			this.onJoinRoom(socket, room.id);
			for (const user of addUsersRoom.users) {
				const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
				const rooms = await this.roomService.getRoomsForUser(user.id);
				for (const connection of connections) {
					await this.server.to(connection.socketId).emit('rooms', rooms);
					if (joinedUsers.find(toto => toto.socketId === connection.socketId))
						await this.server.to(connection.socketId).emit('getMember', addUsersRoom.users);
				}
			}
		}

	}

	@SubscribeMessage('joinRoom')
	async onJoinRoom(socket: Socket, roomId: number) {
		this.onLeaveRoom(socket);
		const updatedRoom: RoomI = await this.roomService.getRoom(roomId);
		const rooms: RoomI[] = await this.roomService.getRoomsForUser(socket.data.user.id)
		if (updatedRoom === null || !rooms.find(toto => toto.id === updatedRoom.id))
			return;
		const messages = await this.messageService.findMessagesForRoom(updatedRoom);
		await this.joinedRoomService.create({ socketId: socket.id, user: socket.data.user, room: updatedRoom });
		await this.server.to(socket.id).emit('messages', { messages: messages, room: updatedRoom, user: socket.data.user});
	}

	@SubscribeMessage('leaveRoom')
	async onLeaveRoom(socket: Socket) {
		await this.joinedRoomService.deleteBySocketId(socket.id);
	}

	@SubscribeMessage('quitRoom')
	async onQuitRoom(socket: Socket, object: {room: RoomI, user: UserI }): Promise<RoomI> {
		// const userToRemove = object.room.users.find(user => user.id === object.user.id);
		// if (!userToRemove)
		// return socket.emit('Error', new UnauthorizedException());
		const updatedRoom: RoomI = await this.roomService.getRoom(object.room.id);
		const quitedRoom: RoomI = await this.roomService.quitRoom(object.user, updatedRoom);

		const joined: JoinedRoomI[] = await this.joinedRoomService.findByRoom(object.room.id);
		const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(object.user);
		const rooms = await this.roomService.getRoomsForUser(object.user.id);
		for (const connection of connections) {
			await this.server.to(connection.socketId).emit('rooms', rooms);
			if (joined.find(toto => toto.socketId === connection.socketId)) {
				await this.server.to(connection.socketId).emit('messages', { messages: null, room: null, user: null });
				await this.joinedRoomService.deleteBySocketId(connection.socketId);
			}
		}
		
		const joinedUsers: JoinedRoomI[] = await this.joinedRoomService.findByRoom(quitedRoom.id);
		for (const user of quitedRoom.users) {
			const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
			const rooms = await this.roomService.getRoomsForUser(user.id);
			for (const connection of connections) {
				await this.server.to(connection.socketId).emit('rooms', rooms);
				if (joinedUsers.find(toto => toto.socketId === connection.socketId))
					await this.server.to(connection.socketId).emit('getMember', quitedRoom.users);
			}
		}
		return quitedRoom;
	}

	@SubscribeMessage('banFromRoom')
	async onBanFromRoom(socket: Socket, object: {room: RoomI, user: UserI }) {
		// const userToRemove = object.room.users.find(user => user.id === object.user.id);
		// if (!userToRemove)
		// return socket.emit('Error', new UnauthorizedException());
		const updatedRoom = await this.onQuitRoom(socket, {room: object.room, user: object.user});
		await this.roomService.addBannedUser(updatedRoom, object.user);
	}

	@SubscribeMessage('deleteRoom')
	async onDeleteRoom(socket: Socket, room: RoomI) {
		room = await this.roomService.getRoom(room.id);
		const joinedUsers: JoinedRoomI[] = await this.joinedRoomService.findByRoom(room.id);
		for (const user of room.users) {
			const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
			for (const connection of connections) {
				if (joinedUsers.find(toto => toto.socketId === connection.socketId)) {
					await this.server.to(connection.socketId).emit('messages', { messages: null, room: null, user: null });
					await this.joinedRoomService.deleteBySocketId(connection.socketId);
				}
			}
		}
		await this.roomService.deleteRoom(room.id);		
		
		for (const user of room.users) {
			const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
			const rooms = await this.roomService.getRoomsForUser(user.id);
			for (const connection of connections) {
				await this.server.to(connection.socketId).emit('rooms', rooms);
			}
		}
	}

	@SubscribeMessage('addMessage')
	async onAddMessage(socket: Socket, message: MessageI) {
		message.room = await this.roomService.getRoom(message.room.id);
		if (message.room.muted.find(toto => toto.id === socket.data.user.id)) {
			return;
		}
		const createdMessage: MessageI = await this.messageService.create({ ...message, user: socket.data.user });
		const room: RoomI = await this.roomService.getRoom(createdMessage.room.id);
		const messages = await this.messageService.findMessagesForRoom(room);
		const joinedUsers: JoinedRoomI[] = await this.joinedRoomService.findByRoom(room.id);
		for (const user of joinedUsers) {
			await this.server.to(user.socketId).emit('addedMessages', messages);
		}
	}

}
