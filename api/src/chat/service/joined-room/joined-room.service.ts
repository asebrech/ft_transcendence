import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinedRoomEntity } from 'src/chat/model/joined-room/joined-room.entity';
import { JoinedRoomI } from 'src/chat/model/joined-room/joined-room.interface';
import { RoomI } from 'src/chat/model/room/room.interface';
import { UserI } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class JoinedRoomService {

	constructor(
		@InjectRepository(JoinedRoomEntity)
		private readonly joinedRoomRepository: Repository<JoinedRoomEntity>
	) { }

	async create(joinedRoom: JoinedRoomI): Promise<JoinedRoomI> {
		return this.joinedRoomRepository.save(joinedRoom);
	}

	async findByUser(user: UserI): Promise<JoinedRoomI[]> {
		return this.joinedRoomRepository.find({ where: { user } })
	}

	async findByRoom(roomId: number): Promise<JoinedRoomI[]> {
		return this.joinedRoomRepository.find({
			where: { room: { id: roomId } }
		});
	}

	async deleteBySocketId(socketId: string) {
		return this.joinedRoomRepository.delete({ socketId });
	}

	async deleteByroomId(roomId: number) {
		await this.joinedRoomRepository
			.createQueryBuilder()
			.delete()
			.from('joined_room_entity')
			.where('roomId = :roomId', { roomId })
			.execute();
	}

	async deleteAll() {
		await this.joinedRoomRepository
			.createQueryBuilder()
			.delete()
			.execute()
	}
}
