import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { RoomEntity } from 'src/chat/model/room/room.entity';
import { RoomI } from 'src/chat/model/room/room.interface';
import { UserI } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';
import { JoinedRoomService } from '../joined-room/joined-room.service';
import { MessageService } from '../message/message.service';

@Injectable()
export class RoomService {

	constructor(
		@InjectRepository(RoomEntity)
		private readonly roomRepository: Repository<RoomEntity>,
		private joinedRoomService: JoinedRoomService,
		private messagesService: MessageService
	) {}

	async createRoom(room: RoomI, creator: UserI): Promise<RoomI> {
		const newRoom = await this.addCreatorToRoom(room, creator);
		newRoom.privateMessage = false;
		return this.roomRepository.save(newRoom);
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
		return this.roomRepository.findOne({ where: { id: roomId }, relations: ['users', 'owner', 'admins', 'baned', 'muted'] });
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

	async addMutedToRoom(room: RoomI, user: UserI): Promise<RoomI> {		
		if (!room.muted){
			room.muted = [];
		}
		room.muted.push(user);
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
