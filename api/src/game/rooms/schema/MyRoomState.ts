import { MapSchema, Schema, type } from "@colyseus/schema";

export class Ball extends Schema {
    @type("number") x: number;
    @type("number") y: number;
}

export class MyRoomState extends Schema {
    @type({ map: Ball }) players = new MapSchema<Ball>();
}