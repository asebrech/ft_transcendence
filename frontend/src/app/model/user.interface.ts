import { Player } from "./player.interface";

export interface UserI {
	id?: number;
	email?: string,
	username?: string,
	isConnected?: boolean,
	inGame?: boolean,
	password?: string;
	wins?: number;
	losses?: number;
	ratio?: number;
	total?: number;
	level?:number;
	friends?: Friend[];
	colorPad?: string;
	profilPic?: string;
	history?: playerHistory[];
	colorBall?: string;
  connected?: boolean;
}

export interface Friend {
	id?: number;
	username?: string;
	isConnected?: boolean,
	inGame?: boolean,
	profilPic?: string;
	win?: number;
	losses?: number;
	history?: playerHistory[];
}

export interface playerHistory {
	userId?: number;
	opponentId?: number;
	won?: boolean;
}
