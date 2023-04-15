import { ConnectedUserEntity } from "src/chat/model/connected-user/connected-user.entity";
import { JoinedRoomEntity } from "src/chat/model/joined-room/joined-room.entity";
import { MessageEntity } from "src/chat/model/message/message.entity";
import { RoomEntity } from "src/chat/model/room/room.entity";
import { RoomI } from "src/chat/model/room/room.interface";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
	
	@ManyToMany(() => RoomEntity, room => room.users)
	rooms: RoomEntity[];

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

	@BeforeInsert()
	@BeforeUpdate( )
	emailToLowerCase() {
		this.email = this.email.toLocaleLowerCase();
		this.username = this.username.toLocaleLowerCase(); 
	}
}