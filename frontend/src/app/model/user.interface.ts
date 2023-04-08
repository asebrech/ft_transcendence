import { Player } from "./player.interface";

export interface UserI {
	id?: number;
	email?: string,
	username?: string,
	password?: string;
 	friend?: UserI[];
  wins?: number;
  losses?: number;
  ratio?: number;
  timeplayed?: number;
}
