/* eslint-disable prettier/prettier */
import { BeforeInsert, BeforeUpdate, Column, Double, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany,OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Friend, UserI } from "./user.interface";
import { RoomEntity } from "src/chat/model/room/room.entity";
import { ConnectedUserEntity } from "src/chat/model/connected-user/connected-user.entity";
import { JoinedRoomEntity } from "src/chat/model/joined-room/joined-room.entity";
import { MessageEntity } from "src/chat/model/message/message.entity";

@Entity()
export class UserEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({unique: true})
	username: string;

	@Column({unique: true})
	email: string;

	@Column({})
	password: string;

	@Column({default: null})
	selectedRoom: number;

	@Column({default: false})
	google_auth: boolean;

	@Column({select: false, default: null})
	google_auth_secret: string;

	@ManyToMany(() => UserEntity, user => user.blockedUsers)
	@JoinTable()
	blockedUsers: UserEntity[];

	@OneToMany(() => RoomEntity, room => room.owner)
	roomsOwner: RoomEntity[];

	@Column({default: ''})
	profilePicture: string;

	@Column({default: 0})
	wins : number;

	@Column({default: 0})
	losses : number;

	@ManyToMany(() => RoomEntity, room => room.admins)
	roomsAdmin: RoomEntity[];

	@ManyToMany(() => RoomEntity, room => room.muted)
	roomsMuted: RoomEntity[];

	@ManyToMany(() => RoomEntity, room => room.baned)
	roomsBaned: RoomEntity[];

	@OneToMany(() => ConnectedUserEntity, connection => connection.user)
	connections: ConnectedUserEntity[];

	@OneToMany(() => JoinedRoomEntity, joinedRoom => joinedRoom.room)
	joinedRooms: JoinedRoomEntity[];

	@OneToMany(() => MessageEntity, message => message.user)
	messages: MessageEntity[] ;

	@Column('double precision', {default: 0})
	ratio : number;

	@Column({default: 0})
	total : number;

	@Column({default: 1})
	level: number;

	@Column({ type: 'jsonb', default: '[]' })
	friends: Friend[];

	@Column({default: 'default'})
	colorPad: string;

	@Column({default: 'default'})
	colorBall: string;

	@Column({ type: 'jsonb', default: '[]' })
	history: [];
}