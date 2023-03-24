import { userInfo } from "os";
import { ConnectedUserEntity } from "src/chat/model/connected-user/connected-user.entity";
import { JoinedRoomEntity } from "src/chat/model/joined-room/joined-room.entity";
import { MessageEntity } from "src/chat/model/message/message.entity";
import { RoomEntity } from "src/chat/model/room/room.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, OneToMany,OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserI } from "./user.interface";

@Entity()
export class UserEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({unique: true})
	username: string;

	@Column({unique: true})
	email: string;

	@Column({select: false})
	password: string;

	@Column({default: false})
	google_auth: boolean;

	@Column({select: false, default: null})
	google_auth_secret: string;

	@Column()
	wins : number;

	@Column()
	losses : number;

	@Column()
	ratio : number;

	@Column()
	timePlayed: number;

	@Column()
	matchHistory: [];

	@OneToMany( () => UserEntity, friend => friend.friend)
	friend: UserEntity[];

}