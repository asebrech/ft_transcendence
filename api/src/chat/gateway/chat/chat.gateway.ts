import { UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/service/auth.service';
import { RoomI } from 'src/chat/model/room.interface';
import { RoomService } from 'src/chat/service/room-service/room/room.service';
import { UserI } from 'src/user/model/user.interface';
import { UserService } from 'src/user/service/user-service/user.service';

@WebSocketGateway({cors: {origin: ['https://hoppscotch.io', 'http://localhost:3000', 'http://localhost:4200']}})
export class ChatGateway  implements OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer()
  server: Server;

	constructor(private authService: AuthService, private userService: UserService, private roomService: RoomService) {};

	async handleConnection(socket: Socket) {
		try {
			const decodedToken = await this.authService.verifyJwt(socket.handshake.headers.authorization);
			const user: UserI  = await this.userService.getOne(decodedToken.user.id);
			if (!user)
			{
				return this.disconnect(socket);
			} else {
				socket.data.user = user;
				const rooms = await this.roomService.getRoomsForUser(user.id, {page: 1, limit: 10});

				// Only emit to the specific connected client
				return this.server.to(socket.id).emit('rooms', rooms);
			}
		} catch {
			return this.disconnect(socket);
		}
}

	handleDisconnect(socket: Socket) {
		socket.disconnect();
}

	private disconnect(socket: Socket) {
		socket.emit('Error', new UnauthorizedException());
		socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI): Promise<RoomI> {
	return this.roomService.createRoom(room, socket.data.user);
  }

}