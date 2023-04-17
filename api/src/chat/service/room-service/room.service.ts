import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { RoomEntity } from 'src/chat/model/room/room.entity';
import { RoomI } from 'src/chat/model/room/room.interface';
import { UserI } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';
import { JoinedRoomService } from '../joined-room/joined-room.service';
import { MessageService } from '../message/message.service';
import { MessageI } from 'src/chat/model/message/message.interface';
import { AuthService } from 'src/auth/service/auth.service';
import { BlockedUser } from 'src/chat/model/blockedUser.interface';

@Injectable()
export class RoomService {

	constructor(
		@InjectRepository(RoomEntity)
		private readonly roomRepository: Repository<RoomEntity>,
		private joinedRoomService: JoinedRoomService,
		private messagesService: MessageService,
		private authService: AuthService

	) {}

	async createRoom(room: RoomI, creator: UserI): Promise<RoomI> {
		const newRoom = await this.addCreatorToRoom(room, creator);
		newRoom.privateMessage = false;
		if (room.isPrivate)
		newRoom.channelPassword = await this.authService.hashPassword(newRoom.channelPassword);
		return this.roomRepository.save(newRoom);
	}

	async checkPass(room: RoomI, pass: string): Promise<boolean> {
		return this.authService.comparePassword(pass, room.channelPassword);
	}

	async changePass(room: RoomI, pass: string): Promise<RoomI> {
		if (!room.isPrivate)
			room.isPrivate = true;
		room.channelPassword = await this.authService.hashPassword(pass);
		return this.roomRepository.save(room);
	}

	async removePass(room: RoomI): Promise<RoomI> {
		room.isPrivate = false;
		room.channelPassword = null;
		return this.roomRepository.save(room);
	}

	async createPrivateMessage(users: UserI[]): Promise<RoomI> {
		
		const newRoom: RoomI = {
			name: 'privateMessage',
			privateMessage: true,
			owner: null,
			users: users
		};
		return this.roomRepository.save(newRoom);
	}

	async getAllRoom(): Promise<RoomI[]> {
		return this.roomRepository.find({relations: ['baned']});
	}

	async getAllRoomWithUsers(): Promise<RoomI[]> {
		return this.roomRepository.find({relations: ['users']});
	}

	async getRoom(roomId: number): Promise<RoomI> {
		return this.roomRepository.findOne({ where: { id: roomId }, relations: ['users', 'owner', 'admins', 'baned'] });
	}

	async getRoomWithPass(roomId: number): Promise<RoomI> {
		return this.roomRepository.findOne({ where: { id: roomId },
				relations: ['users', 'owner', 'admins', 'baned'],
				select: ['id', 'name', 'description','privateMessage', 'isPrivate', 'channelPassword', 'users', 'owner', 'admins', 'baned', 'muted', 'created_at', 'updated_at'] });
	}

	async updateRoom(room: RoomI): Promise<RoomI> {
		room.updated_at = new Date();
		return this.roomRepository.save(room);
	}

	getRoomCredential(user: UserI, room: RoomI): RoomI {
		if (user.id != room.owner.id) {
			room.owner = null;
		}
		return room;
	}

	async getRoomsForUser(userId: number): Promise<RoomEntity[]> {
		const query = this.roomRepository
		.createQueryBuilder('room')
		.leftJoin('room.users', 'users')
		.where('users.id = :userId', {userId})
		.leftJoinAndSelect('room.users', 'all_users')
		.orderBy('room.updated_at', 'DESC');

		return query.getMany();
	}

	formatPrivateRooms(user: UserI, rooms: RoomI[]): RoomI[] {
		for (let i = 0; i < rooms.length; i++) {
			if (rooms[i].privateMessage === true) {
				for (const toto of rooms[i].users) {
					if (toto.id !== user.id) {
						rooms[i].name = toto.username;
						break;
					}
				}
			}
		}
		return rooms;
	}

	formatPrivateRoom(user: UserI, room: RoomI): RoomI {
			if (room.privateMessage === true) {
				for (const toto of room.users) {
					if (toto.id !== user.id) {
						room.name = toto.username;
						break;
					}
				}
			}
		return room;
	}

	formatMessage(user: UserI, messages: MessageI[]): MessageI[] {

		// for (let i = 0; i < messages.length; i++) {
		// 	for(const blocked of user.blockedUsers) {
		// 		if (blocked.id === messages[i].user.id) {
		// 			messages[i].text = 'Message Blocked';
		// 			break;
		// 		}
		// 	}
		// }
		// return messages;

		const filteredMessages = messages.filter(message => {
			return !user.blockedUsers.some(blocked => blocked.id === message.user.id);
		  });
		  
		  return filteredMessages;
	}

	async addCreatorToRoom(room: RoomI, creator: UserI): Promise<RoomI> {
		if (!room.users){
			room.users = [];
		}
		room.owner = creator;
		room.users.push(creator);
		return room;
	}

	async chaneNameRoom(name: string, room: RoomI): Promise<RoomI> {
		const roomUpdate = await this.getRoom(room.id);
		roomUpdate.name = name;
		return this.roomRepository.save(roomUpdate);
	}

	async addUsersToRoom(room: RoomI, users: UserI[]): Promise<RoomI> {		
		for (const user of users) {
			room.users.push(user);
		}
		return this.roomRepository.save(room);
	}
	
	async addAdminToRoom(room: RoomI, user: UserI): Promise<RoomI> {		
		if (!room.admins){
			room.admins = [];
		}
		room.admins.push(user);
		return this.roomRepository.save(room);
	} 

	async removeAdminToRoom(room: RoomI, user: UserI): Promise<RoomI> {		
		const index = room.admins.findIndex(obj => obj.id === user.id);
			if (index !== -1)
  				room.admins.splice(index, 1);
 			return this.roomRepository.save(room);
	} 

	async addMutedToRoom(room: RoomI, muted: BlockedUser): Promise<RoomI> {		
		if (!room.muted){
			room.muted = [];
		}
		const id = muted.id;
		let date: Date;
		if (muted.date)
			date = muted.date
		else
			date = null;
		room.muted.push({id, date});
		return this.roomRepository.save(room);
	} 

	async removeMutedToRoom(room: RoomI, user: UserI): Promise<RoomI> {		
		const index = room.muted.findIndex(obj => obj.id === user.id);
			if (index !== -1)
  				room.muted.splice(index, 1);
 			return this.roomRepository.save(room);
	} 

	async quitRoom(userToRemove: UserI, room: RoomI): Promise<RoomI> {
			const index = room.users.findIndex(obj => obj.id === userToRemove.id);
			if (index !== -1)
  				room.users.splice(index, 1);
 			return this.roomRepository.save(room);
	}

	async addBannedUser(room: RoomI, user: UserI): Promise<RoomI> {		
		if (!room.baned){
			room.baned = [];
		}
		room.baned.push(user);
		return this.roomRepository.save(room);
	} 

	async deleteRoom(roomId: number){
		this.messagesService.deleteByRoomId(roomId);
		this.joinedRoomService.deleteByroomId(roomId);
		await this.roomRepository.remove(await this.roomRepository.findOne({ where: { id: roomId }, relations: ['users', 'owner', 'admins', 'baned', 'muted'] }));
	}
}
