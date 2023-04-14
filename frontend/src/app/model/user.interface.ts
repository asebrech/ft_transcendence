import { Player } from "./player.interface";

export interface UserI {
	id?: number;
	email?: string,
	username?: string,
	password?: string;
	friend?: number[];
	wins?: number;
	losses?: number;
	ratio?: number;
	total?: number;
	level?:number;
}
