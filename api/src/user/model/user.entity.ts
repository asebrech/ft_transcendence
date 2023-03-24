import { userInfo } from "os";
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

	@Column({default: 0})
	wins : number;

	@Column({default: 0})
	losses : number;

	@Column({default: 0})
	ratio : number;

	@Column({default: 0})
	timePlayed: number;

	@OneToMany( () => UserEntity, friend => friend.friend)
	friend: UserEntity[];

}