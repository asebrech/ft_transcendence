/* eslint-disable prettier/prettier */
import { userInfo } from "os";
import { BeforeInsert, BeforeUpdate, Column, Double, Entity, ManyToMany, ManyToOne, OneToMany,OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Friend, UserI } from "./user.interface";
import { ParseFloatPipe } from "@nestjs/common";

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

	@Column({default: false})
	google_auth: boolean;

	@Column({select: false, default: null})
	google_auth_secret: string;

	@Column({default: ''})
	profilePicture: string;

	@Column({default: 0})
	wins : number;

	@Column({default: 0})
	losses : number;

	@Column('double precision', {default: 0})
	ratio : number;

	@Column({default: 0})
	total : number;

	@Column({default: 1})
	level: number;

	@Column({ type: 'jsonb', default: '[]' })
	friends: Friend[];
}