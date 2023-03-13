import { Room, Client, Server } from "colyseus";
import { Schema } from "@colyseus/schema";

let player = new Map<string, string>()

interface screen_size 
{
  x : number;
  y : number;
};

interface new_pos_ball
{  
  x : number;
  y : number;
};

export class MyRoom extends Room<Schema> 
{

  rdyPlayer = 2;
  player_screen : screen_size = {x : 0, y : 0};
  new_pos : new_pos_ball = {x : 0, y : 0};


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
      player.set(client.sessionId, "player_left");
    else if (this.clients.length == 2)
    {
      player.set(client.sessionId, "player_right");
    }
    else
      player.set(client.sessionId, "spectator");

    ///////////////////////////////////////////
    console.log(player.get(client.sessionId))
    console.log(client.sessionId + " is connected to " + this.roomId + " , now this room has " + player.get(client.sessionId))
    //////////////////////////////////////////
    if (this.clients.length == 2)
    {
      this.broadcast("second_player_found", ({}));
      console.log("[ROOM IS FULL]")
    }
    //////////////////////////////////////////
    //--------------------------------------------//
    this.onMessage("move", (client, message) =>
    {
      if (player.get(client.sessionId) == "player_left")
        this.broadcast("paddle_left", message);
      if (player.get(client.sessionId) == "player_right")
        this.broadcast("paddle_right",message);
    });
    this.onMessage("player_joined", (client, message) =>
    {
      if (player.get(client.sessionId) == "player_left")
      {
        this.player_screen.x = message.x;
        this.player_screen.y = message.y;
      };
      if (player.get(client.sessionId) == "player_right")
      {
        if (this.player_screen.x > 0 && this.player_screen.y > 0)
        {
          client.send("screen_size", ({x : this.player_screen.x, y : this.player_screen.y }))
        }
      }
    });
    //--------------------------------------------//
    ///////////////////////////////////////////
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
