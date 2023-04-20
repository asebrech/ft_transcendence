import { Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import console from 'console';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/service/auth.service';
import { BlockedUser } from 'src/chat/model/blockedUser.interface';
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

@WebSocketGateway({ cors: { origin: '*' } })
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
		const connections: ConnectedUserI[] = await this.connectedUserService.findAll();
		const users: UserI[] = [];
		for(const connection of connections) {
			if (!users.some(toto => toto.id === connection.user.id))
				users.push(connection.user);
		}
		for(const connection of connections) {
			await this.server.to(connection.socketId).emit('connected', users);
		}
	}

	private async disconnect(socket: Socket) {
		socket.emit('Error', new UnauthorizedException());
		await this.connectedUserService.deleteBySocketId(socket.id);
		socket.disconnect();
		const connections: ConnectedUserI[] = await this.connectedUserService.findAll();
		const users: UserI[] = [];
		for(const connection of connections) {
			if (!users.some(toto => toto.id === connection.user.id))
				users.push(connection.user);
		}
		for(const connection of connections) {
			await this.server.to(connection.socketId).emit('connected', users);
		}
	}

	@SubscribeMessage('connected')
	async isConnected(socket: Socket, user:UserI) {
		const connections: ConnectedUserI[] = await this.connectedUserService.findAll();
		const users: UserI[] = [];
		for(const connection of connections) {
			if (!users.some(toto => toto.id === connection.user.id))
				users.push(connection.user);
		}
		await this.server.to(socket.id).emit('connected', users);
	}

	@SubscribeMessage('createRoom')
	async onCreateRoom(socket: Socket, room: RoomI) {
		const createdRoom: RoomI = await this.roomService.createRoom(room, socket.data.user);

		for (const user of createdRoom.users) {
			const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
			let rooms: RoomI[] = await this.roomService.getRoomsForUser(user.id);
			rooms = this.roomService.formatPrivateRooms(user, rooms);
			for (const connection of connections) {
				await this.server.to(connection.socketId).emit('rooms', rooms);
			}
		}
		this.onJoinRoom(socket, createdRoom.id);
	}

	@SubscribeMessage('privateMessage')
	async privateMessage(socket: Socket, user: UserI) {
		const rooms: RoomI[] = await this.roomService.getAllRoomWithUsers();
		user = await this.userService.getOne(user.id);
		if (user.blockedUsers.some(toto => toto.id === socket.data.user.id))
			return;
		for (const room of rooms) {
			if (room.privateMessage) {
				if (room.users && room.users.find(toto => toto.id === user.id) && room.users.find(toto => toto.id === socket.data.user.id)) {
					return this.onJoinRoom(socket, room.id);
				}
			}
		}
		const newRoom: RoomI = await this.roomService.createPrivateMessage([user, socket.data.user]);
		for (const user of newRoom.users) {
			const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
			let rooms: RoomI[] = await this.roomService.getRoomsForUser(user.id);
			rooms = this.roomService.formatPrivateRooms(user, rooms);
			for (const connection of connections) {
				await this.server.to(connection.socketId).emit('rooms', rooms);
			}
		}
		return this.onJoinRoom(socket, newRoom.id);
	}

	@SubscribeMessage('changeName')
	async changeName(socket: Socket, object: { name: string, room: RoomI }) {
		const room: RoomI = await this.roomService.chaneNameRoom(object.name, object.room);
		for (const user of room.users) {
			const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
			let rooms: RoomI[] = await this.roomService.getRoomsForUser(user.id);
			rooms = this.roomService.formatPrivateRooms(user, rooms);
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
		for (const room of rooms) {
			const baned = room.baned.find(toto => toto.id === socket.data.user.id)
			if (baned){
				if (baned.date != null && new Date(baned.date) < new Date()) {
					await this.roomService.removeBanedToRoom(room, socket.data.user);
				}
				else {
					const index = rooms.findIndex(toto => toto.id === room.id)
					if (index !== -1) {
						rooms.splice(index, 1);
					}
				}
			}
		}
		const index = users.findIndex(obj => obj.id === socket.data.user.id);
		if (index !== -1)
			users.splice(index, 1);
		for (let i = 0; i < users.length; i++) {
			if (users[i].blockedUsers.some(toto => toto.id === socket.data.user.id))
			{
				users.splice(i, 1);
			}
			else
			{
				users[i].name = users[i].username;
			}
		}
		for (let i = 0; i < rooms.length; i++) {
			if (rooms[i].privateMessage === true) {
				rooms.splice(i, 1);
				i--;
			}
		}

		let merged = [...rooms, ...users];
		merged = this.AlphaOrder(merged)
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
		users = this.AlphaOrderUser(users);
		return this.server.to(socket.id).emit('getUsers', users);
	}

	@SubscribeMessage('listMember')
	async listMember(socket: Socket, room: RoomI) {
		if (!room)
			return this.server.to(socket.id).emit('getMember', null);
		const updatedRoom = await this.roomService.getRoom(room.id);
		//if (updatedRoom)
		return this.server.to(socket.id).emit('getMember', this.AlphaOrderUser(updatedRoom.users));
	}

	@SubscribeMessage('addUsers')
	async addUsers(socket: Socket, object: { users: UserI[], room: RoomI }) {
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

		for (const user of object.users) {
			let rooms: RoomI[] = await this.roomService.getRoomsForUser(user.id);
			const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
			rooms = this.roomService.formatPrivateRooms(user, rooms);
			for (const connection of connections) {
				await this.server.to(connection.socketId).emit('rooms', rooms);
			}
		}
		for (const joined of joinedUsers) {
			await this.server.to(joined.socketId).emit('getMember', this.AlphaOrderUser(addUsersRoom.users));
		}
	}

	@SubscribeMessage('giveOwnership')
	async giveOwnership(socket: Socket, object: { user: UserI, room: RoomI }) {
		object.room = await this.roomService.getRoom(object.room.id);
		const addAdminRoom: RoomI = await this.roomService.changeOwner(object.room, object.user);
		this.displayChange(addAdminRoom);
	}

	@SubscribeMessage('addAdmin')
	async addAdmin(socket: Socket, object: { user: UserI, room: RoomI }) {
		object.room = await this.roomService.getRoom(object.room.id);
		const addAdminRoom: RoomI = await this.roomService.addAdminToRoom(object.room, object.user);
		this.displayChange(addAdminRoom);
	}

	@SubscribeMessage('removeAdmin')
	async removeAdmin(socket: Socket, object: { user: UserI, room: RoomI }) {
		object.room = await this.roomService.getRoom(object.room.id);
		const addAdminRoom: RoomI = await this.roomService.removeAdminToRoom(object.room, object.user);
		this.displayChange(addAdminRoom);
	}

	@SubscribeMessage('addMuted')
	async addMuted(socket: Socket, object: { muted: BlockedUser, room: RoomI }) {
		object.room = await this.roomService.getRoom(object.room.id);
		const upRoom: RoomI = await this.roomService.addMutedToRoom(object.room, object.muted);
		this.displayChange(upRoom);
	}

	@SubscribeMessage('removeMuted')
	async removeMuted(socket: Socket, object: { user: UserI, room: RoomI }) {
		object.room = await this.roomService.getRoom(object.room.id);
		const upRoom: RoomI = await this.roomService.removeMutedToRoom(object.room, object.user);
		this.displayChange(upRoom);
	}

	@SubscribeMessage('paginateRooms')
	async onPaginatieRoom(socket: Socket) {
		if (!socket || !socket.data || !socket.data.user || !socket.data.user.id)
			return;
		let rooms: RoomI[] = await this.roomService.getRoomsForUser(socket.data.user.id);
		rooms = this.roomService.formatPrivateRooms(socket.data.user, rooms);
		return this.server.to(socket.id).emit('rooms', rooms);
	}

	@SubscribeMessage('addUserToRoom')
	async addUserToRoom(socket: Socket, room: RoomI) {

		let upRoom = await this.roomService.getRoom(room.id);

		if (upRoom.users.find(user => user.id === socket.data.user.id)) {
			this.onJoinRoom(socket, room.id);
		}
		else {
			if (room.isPrivate) {
				return socket.emit('checkPass', room);
			}
			let users: UserI[] = [];
			users.push(socket.data.user);
			const addUsersRoom: RoomI = await this.roomService.addUsersToRoom(upRoom, users);
			const joinedUsers: JoinedRoomI[] = await this.joinedRoomService.findByRoom(addUsersRoom.id);

			this.onJoinRoom(socket, room.id);

			for (const user of users) {
				let rooms: RoomI[] = await this.roomService.getRoomsForUser(user.id);
				const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
				rooms = this.roomService.formatPrivateRooms(user, rooms);
				for (const connection of connections) {
					await this.server.to(connection.socketId).emit('rooms', rooms);
				}
			}
			for (const joined of joinedUsers) {
				await this.server.to(joined.socketId).emit('getMember', this.AlphaOrderUser(addUsersRoom.users));
			}
		}
	}

	@SubscribeMessage('checkPass')
	async checkpass(socket: Socket, object: {pass: string, room: RoomI}) {
		const upRoom = await this.roomService.getRoomWithPass(object.room.id);
		if(await this.roomService.checkPass(upRoom, object.pass)) {
			await this.addConfirmUser(socket, object.room);
			socket.emit('confirmPass', false);
		}
	}

	@SubscribeMessage('changePass')
	async changePass(socket: Socket, object: {pass: string, room: RoomI}) {
		const upRoom = await this.roomService.getRoomWithPass(object.room.id);
		const wasPrivate = upRoom.isPrivate;
		await this.roomService.changePass(upRoom, object.pass);
		upRoom.channelPassword = null;
		if (!wasPrivate)
			this.displayChange(upRoom);
	}

	@SubscribeMessage('removePass')
	async removePass(socket: Socket, room: RoomI) {
		const upRoom = await this.roomService.getRoomWithPass(room.id);
		await this.roomService.removePass(upRoom);
		upRoom.channelPassword = null;
		this.displayChange(upRoom);
	}

	async addConfirmUser(socket: Socket, room: RoomI) {
		const upRoom = await this.roomService.getRoomWithPass(room.id);

		let users: UserI[] = [];
			users.push(socket.data.user);
			const addUsersRoom: RoomI = await this.roomService.addUsersToRoom(upRoom, users);
			const joinedUsers: JoinedRoomI[] = await this.joinedRoomService.findByRoom(addUsersRoom.id);

			this.onJoinRoom(socket, room.id);

			for (const user of users) {
				let rooms: RoomI[] = await this.roomService.getRoomsForUser(user.id);
				const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
				rooms = this.roomService.formatPrivateRooms(user, rooms);
				for (const connection of connections) {
					await this.server.to(connection.socketId).emit('rooms', rooms);
				}
			}
			for (const joined of joinedUsers) {
				await this.server.to(joined.socketId).emit('getMember', this.AlphaOrderUser(addUsersRoom.users));
			}
	}

	@SubscribeMessage('joinRoom')
	async onJoinRoom(socket: Socket, roomId: number) {
		this.onLeaveRoom(socket);
		const updatedRoom: RoomI = await this.roomService.getRoom(roomId);
		let rooms: RoomI[] = await this.roomService.getRoomsForUser(socket.data.user.id)
		rooms = this.roomService.formatPrivateRooms(socket.data.user, rooms);
		if (updatedRoom === null || !rooms.find(toto => toto.id === updatedRoom.id))
			return;
		const messages = await this.messageService.findMessagesForRoom(updatedRoom);
		await this.joinedRoomService.create({ socketId: socket.id, user: socket.data.user, room: updatedRoom });
		const formatRoom = this.roomService.formatPrivateRoom(socket.data.user, updatedRoom);
		const upUser: UserI = await this.userService.getOne(socket.data.user.id)
		const formatMessages: MessageI[] = this.roomService.formatMessage(upUser, messages);
		await this.server.to(socket.id).emit('messages', { messages: formatMessages, room: formatRoom, user: socket.data.user });
	}

	@SubscribeMessage('leaveRoom')
	async onLeaveRoom(socket: Socket) {
		await this.joinedRoomService.deleteBySocketId(socket.id);
	}

	@SubscribeMessage('quitRoom')
	async onQuitRoom(socket: Socket, object: { room: RoomI, user: UserI }): Promise<RoomI> {
		const updatedRoom: RoomI = await this.roomService.getRoom(object.room.id);
		const quitedRoom: RoomI = await this.roomService.quitRoom(object.user, updatedRoom);

		const joined: JoinedRoomI[] = await this.joinedRoomService.findByRoom(object.room.id);
		const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(object.user);
		let rooms: RoomI[] = await this.roomService.getRoomsForUser(object.user.id);
		rooms = this.roomService.formatPrivateRooms(object.user, rooms);
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
			let rooms: RoomI[] = await this.roomService.getRoomsForUser(user.id);
			rooms = this.roomService.formatPrivateRooms(user, rooms);
			for (const connection of connections) {
				await this.server.to(connection.socketId).emit('rooms', rooms);
				if (joinedUsers.find(toto => toto.socketId === connection.socketId))
					await this.server.to(connection.socketId).emit('getMember', this.AlphaOrderUser(quitedRoom.users));
			}
		}
		return quitedRoom;
	}

	@SubscribeMessage('banFromRoom')
	async onBanFromRoom(socket: Socket, object: { room: RoomI, user: UserI, baned: BlockedUser }) {
		const updatedRoom = await this.onQuitRoom(socket, { room: object.room, user: object.user });
		await this.roomService.addBannedUser(updatedRoom, object.baned);
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
			let rooms: RoomI[] = await this.roomService.getRoomsForUser(user.id);
			rooms = this.roomService.formatPrivateRooms(user, rooms);
			for (const connection of connections) {
				await this.server.to(connection.socketId).emit('rooms', rooms);
			}
		}
	}

	@SubscribeMessage('addMessage')
	async onAddMessage(socket: Socket, message: MessageI) {
		message.room = await this.roomService.getRoom(message.room.id);
		const muted: BlockedUser = message.room.muted.find(toto => toto.id === socket.data.user.id)
		if (muted){
			if (muted.date != null && new Date(muted.date) < new Date()) {
				await this.removeMuted(socket, {user: socket.data.user, room: message.room})
			}
			else {
				return;
			}
		}
		const createdMessage: MessageI = await this.messageService.create({ ...message, user: socket.data.user });
		let room: RoomI = await this.roomService.getRoom(createdMessage.room.id);
		room = await this.roomService.updateRoom(room);
		const messages = await this.messageService.findMessagesForRoom(room);
		const joinedUsers: JoinedRoomI[] = await this.joinedRoomService.findByRoom(room.id);
		for (const user of joinedUsers) {
			const upUser: UserI = await this.userService.getOne(user.user.id)
			if (upUser.blockedUsers.some(toto => toto.id === socket.data.user.id)) {
				continue;
			}
			const formatMessages: MessageI[] = this.roomService.formatMessage(upUser, messages);
			await this.server.to(user.socketId).emit('addedMessages', formatMessages);
		}
		for (const user of room.users) {
			const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
			let rooms: RoomI[] = await this.roomService.getRoomsForUser(user.id);
			rooms = this.roomService.formatPrivateRooms(user, rooms);
			for (const connection of connections) {
				await this.server.to(connection.socketId).emit('rooms', rooms);
			}
		}
	}

	@SubscribeMessage('checkBlocked')
	async checkBlocked(socket: Socket, room: RoomI) {
		let upRoom: RoomI = await this.roomService.getRoom(room.id);
		let okay: boolean = false;
		for(const user of upRoom.users) {
			const muted: BlockedUser = upRoom.muted.find(toto => toto.id === user.id)
			if (muted){
				if (muted.date != null && new Date(muted.date) < new Date()) {
					upRoom = await this.roomService.removeMutedToRoom(upRoom, user)
					okay = true;
				}
			}
		}
		if (okay)
			this.displayChange(upRoom);
	}


	@SubscribeMessage('blockUser')
	async blockUser(socket: Socket, object: { room: RoomI, user: UserI }) {
		const user = await this.userService.addBlockedUser(object.user, socket.data.user);
		// const rooms: RoomI[] = await this.roomService.getAllRoomWithUsers();
		// for (const room of rooms) {
		// 	if (room.privateMessage) {
		// 		for (const roomUser of room.users) {
		// 			if (user.blockedUsers.some(toto => toto.id === roomUser.id)) {
		// 				if (room.id === object.room)
		// 					return await this.onDeleteRoom(socket, await this.roomService.getRoom(room.id));
		// 				else {
		// 					this.roomService.deleteRoom(room.id);
		// 				}
		// 				break;
		// 			}
		// 		}
		// 	}
		// }
		if (object.room) {
			const upRoom: RoomI = await this.roomService.getRoom(object.room.id);
			this.displayChange(upRoom);
		}
	}

	@SubscribeMessage('unBlockUser')
	async UnBlockUser(socket: Socket, object: { room: RoomI, user: UserI }) {
		await this.userService.removeBlockedUser(object.user, socket.data.user);
		if (object.room) {
			const upRoom: RoomI = await this.roomService.getRoom(object.room.id);
			this.displayChange(upRoom);
		}
	}

	@SubscribeMessage('checkIfBlocked')
	async checkIfBlocked(socket: Socket, user: UserI): Promise<boolean> {
		const upUser: UserI = await this.userService.getOne(socket.data.user.id);
		return this.server.to(socket.id).emit('isBlocked', upUser.blockedUsers.some(blocked => blocked.id === user.id));
	}

	async displayChange(room: RoomI) {
		const joined: JoinedRoomI[] = await this.joinedRoomService.findByRoom(room.id);
		const messages: MessageI[] = await this.messageService.findMessagesForRoom(room);
		for (const userRoom of room.users) {
			const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(userRoom);
			for (const connection of connections) {
				if (joined.find(toto => toto.socketId === connection.socketId)) {
					const formatRoom = this.roomService.formatPrivateRoom(userRoom, room);
					const upUser: UserI = await this.userService.getOne(userRoom.id)
					const formatMessages: MessageI[] = this.roomService.formatMessage(upUser, messages);
					await this.server.to(connection.socketId).emit('messages', { messages: formatMessages, room: formatRoom, user: userRoom });
				}
			}
		}
	}

	AlphaOrder(toSort: any[]): any[] {
		toSort.sort((a, b) => {
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
		return toSort;
	}
	AlphaOrderUser(toSort: UserI[]): UserI[] {
		toSort.sort((a, b) => {
			const nameA = a.username.toLowerCase();
			const nameB = b.username.toLowerCase();

			if (nameA < nameB) {
				return -1;
			} else if (nameA > nameB) {
				return 1;
			} else {
				return 0;
			}
		});
		return toSort;
	}
}
