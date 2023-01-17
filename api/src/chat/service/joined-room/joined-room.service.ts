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
		private readonly joinedRoomEntity: Repository<JoinedRoomEntity>
	) { }

	async create(joinedRoom: JoinedRoomI): Promise<JoinedRoomI> {
		return this.joinedRoomEntity.save(joinedRoom);
	}

	async findByUser(user: UserI): Promise<JoinedRoomEntity[]>  {
		return this.joinedRoomEntity.find({ where: { user } })
	}

	async findByRoom(room: RoomI): Promise<JoinedRoomI[]> {
		return this.joinedRoomEntity.find({ where: { room } });
	}

	async deleteBySocketId(socketId: string) {
		return this.joinedRoomEntity.delete({ socketId });
	}

	async deleteAll() {
		await this.joinedRoomEntity
			.createQueryBuilder()
			.delete()
			.execute()
	}
}
