import { Player } from "./player.interface";

export interface UserI {
	id?: number;
	email?: string,
	username?: string,
	password?: string;
  playerstats?: Player;
}
