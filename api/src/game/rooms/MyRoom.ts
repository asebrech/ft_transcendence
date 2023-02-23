import { Room, Client, Server } from "colyseus";
import http from "http"
import { throws } from "assert";
import { Schema } from "@colyseus/schema";
import { IBroadcastOptions } from "@colyseus/core/build/Room";
import { runInThisContext } from "vm";

let player = new Map<string, string>()

export class State extends Schema 
{


}

export class MyRoom extends Room<Schema> {
    // When room is initialized
    onCreate (options: any) 
    {
      console.log("room " + this.roomId + " created successfully");
    }

    // Authorize client based on provided options before WebSocket handshake is complete
    // onAuth (client: Client, options: any, request: http.IncomingMessage) 
    // {
    //   return true;
    // }
   
    // When client successfully join the room
    onJoin (client: Client, options: any, auth: any) 
    {
      if (this.clients.length == 1)
        player.set(client.sessionId, "player_left")
      else
        player.set(client.sessionId, "player_right")
  
      ///////////////////////////////////////////
      console.log(player.get(client.sessionId))
      console.log(client.sessionId + " is connected to " + this.roomId + " , now this room has " + player.get(client.sessionId))
      //////////////////////////////////////////
      if (this.clients.length == 2)
      {
        console.log("2 player ready");
      }
      this.onMessage("ready", (client, message) =>
      {
        this.broadcast("launch", {x : 400, y : 400});
      })
      //////////////////////////////////////////
      this.onMessage("move", (client, message) =>{
        if (player.get(client.sessionId) == "player_left")
          this.broadcast("paddle_left", message);
        if (player.get(client.sessionId) == "player_right")
          this.broadcast("paddle_right",message);
      })
      //////////////////////////////////////////
      this.onMessage("ball_pos", (client, message)=>{
          this.broadcast("position", {x : message.x, y : message.y});
      })

    }
    // When a client leaves the room
    onLeave (client: Client, consented: boolean) 
    {
      client.leave();    
      console.log(client.sessionId + " left " + this.roomId + " , now this room has " + this.clients.length)
    }


    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
}
