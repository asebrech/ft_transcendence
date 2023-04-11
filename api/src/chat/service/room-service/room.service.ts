import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { RoomEntity } from 'src/chat/model/room/room.entity';
import { RoomI } from 'src/chat/model/room/room.interface';
import { UserI } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {

	constructor(
		@InjectRepository(RoomEntity)
		private readonly roomRepository: Repository<RoomEntity>
	) {}

	async createRoom(room: RoomI, creator: UserI): Promise<RoomI> {
		const newRoom = await this.addCreatorToRoom(room, creator);
		return this.roomRepository.save(newRoom);
	}

	async getAllRoom(): Promise<RoomI[]> {
		return this.roomRepository.find();
	}

	async getRoom(roomId: number): Promise<RoomI> {
		return this.roomRepository.findOne({ where: { id: roomId }, relations: ['users', 'owner'] });
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
}
