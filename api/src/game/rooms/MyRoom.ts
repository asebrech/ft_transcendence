import { Room, Client } from "colyseus";
import http from "http"
import { MyRoomState } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {

    // When room is initialized
    onCreate (options: any) 
    {
      console.log("room " + this.roomId + " created successfully");
    }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth (client: Client, options: any, request: http.IncomingMessage) 
    {
      return true;
    }

    // When client successfully join the room
    onJoin (client: Client, options: any, auth: any) 
    {
      console.log(client.id + " is connected")
    }

    // When a client leaves the room
    onLeave (client: Client, consented: boolean) 
    {

    }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
}
