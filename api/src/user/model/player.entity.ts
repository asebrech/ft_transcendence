import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";


@Entity()
export class PlayerEntity {
@PrimaryGeneratedColumn()
id: number;

@Column()
username : string;

@Column()
wins : number;

@Column()
losses : number;

@Column()
ratio : number;

@Column()
timePlayed: number

@Column()
matchHistory: [];

@OneToMany(() => UserEntity, user => user.player)
friend: UserEntity[];
}