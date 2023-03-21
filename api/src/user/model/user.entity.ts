import { ConnectedUserEntity } from "src/chat/model/connected-user/connected-user.entity";
import { JoinedRoomEntity } from "src/chat/model/joined-room/joined-room.entity";
import { MessageEntity } from "src/chat/model/message/message.entity";
import { RoomEntity } from "src/chat/model/room/room.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, OneToMany,OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PlayerEntity } from "./player.entity";
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
	
	@ManyToMany(() => RoomEntity, room => room.users)
	rooms: RoomEntity[];

	@OneToMany(() => ConnectedUserEntity, connection => connection.user)
	connections: ConnectedUserEntity[];

	@OneToMany(() => JoinedRoomEntity, joinedRoom => joinedRoom.room)
	joinedRooms: JoinedRoomEntity[];

	@OneToMany(() => MessageEntity, message => message.user)
	messages: MessageEntity[] ;

	@OneToOne(() => PlayerEntity, player => player.friend)
	player: PlayerEntity;	

	@BeforeInsert()
	@BeforeUpdate( )
	emailToLowerCase() {
		this.email = this.email.toLocaleLowerCase();
		this.username = this.username.toLocaleLowerCase(); 
	}
}