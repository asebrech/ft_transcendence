import { Room, Client } from "colyseus";
import http from "http"
import { throws } from "assert";
import { Schema } from "@colyseus/schema";
import { IBroadcastOptions } from "@colyseus/core/build/Room";

let max_p : number = 0;
let player = new Map<string, string>()

export class State extends Schema 
{
  ball : any = {};

  something = "This attribute won't be sent to the client-side";

  createPlayer(sessionId: string) 
  {
  }

  removePlayer(sessionId: string) 
  {
  }

}


export class MyRoom extends Room<State> {
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
    // this.onMessage("move" , (client, message) => 
    // {
    //   console.log(client.sessionId)
    //   // handle schema-encoded "SchemaMessage"
    //   // (get autocompletion for "message")
    // });   


    // When client successfully join the room
    onJoin (client: Client, options: any, auth: any) 
    {
      max_p += 1;
      if (max_p == 1)
        player.set(client.sessionId, "player_left")
      else
        player.set(client.sessionId, "player_right")
      console.log(client.sessionId + " is connected to " + this.roomId + " , now this room has " + player.get(client.sessionId))
      if (max_p == 2)
      {
        client.send("ready");   
      }

      this.onMessage("move", (client, message) =>{
        if (player.get(client.sessionId) == "player_left")
          this.broadcast("paddle_left", message);
        else if (player.get(client.sessionId) == "player_right")
          this.broadcast("paddle_right", message);
      })
    }
    // When a client leaves the room
    onLeave (client: Client, consented: boolean) 
    {
      max_p -= 1;
      player.delete(client.sessionId);
    }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
}
