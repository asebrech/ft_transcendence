import { Room, Client, Server } from "colyseus";
import { matchMaker } from "colyseus";
import { Schema } from "@colyseus/schema";

let player = new Map<string, string>()

export class MyRoom extends Room<Schema> 
{

  rdyPlayer = 2;
  // When room is initialized
  onCreate (options: any) 
  {
    console.log("room " + this.roomId + " created successfully");
  }
  
  // When client successfully join the room
  onJoin (client: Client, options: any, auth: any) 
  {
    if (this.clients.length == 1)
    {
      player.set(client.sessionId, "player_left");
      try
      {
        client.send("left_player");
      }
      catch
      {
        console.error("error could not send [request_left_player_screen]")
      }
    }
    else if (this.clients.length == 2)
    {
      player.set(client.sessionId, "player_right");
      try
      {
        client.send("right_player");
      }
      catch
      {
        console.error("error could not send [request_right_player_screen]")
      }
      this.broadcast("second_player_found");
    }
    else
      player.set(client.sessionId, "spectator");
    ///////////////////////////////////////////
    console.log(player.get(client.sessionId))
    console.log(client.sessionId + " is connected to " + this.roomId + " , now this room has " + player.get(client.sessionId))
    ///////////////////////////////////////////
    this.onMessage("move_left_pad", (client, message) =>
    {
      if (player.get(client.sessionId) == "player_left")
      {
        try
        {
          this.broadcast("paddle_left", ({x : message.x, y : message.y}));
        }
        catch
        {
          console.error("cannot send to right player paddle movement")
        }
      }
    });

    this.onMessage("move_right_pad", (client, message) =>
    {
      if (player.get(client.sessionId) == "player_right")
      {
        try
        {
          this.broadcast("paddle_right", ({x : message.x, y : message.y}));
        }
        catch
        {
          console.error("cannot send to left player paddle movement");
        }
      }
    });


    this.onMessage("ready" , (client, message) =>
    {
      this.rdyPlayer--;
      if (this.rdyPlayer == 0)
      {
        try
        {
          this.clients[0].send("launch", ({x: 300, y : 300}));
        }
        catch
        {
          console.error("error could not send [launch]")
        }
      }
    });
    //////////////////////////////////////////
    this.onMessage("ball_position", (client, message) =>
    {
      if (player.get(client.sessionId) == "player_left")
      {
        try 
        {
          this.broadcast("set_ball_position", ({x : message.x, y : message.y}));
        }
        catch 
        {
          console.error("error could not send [set_ball_position]")
        }
      }
    });
    ///////////////////////////////////////////
  }

  // When a client leaves the room
  onLeave (client: Client, consented: boolean) 
  {
    client.leave();    
    console.log(client.sessionId + " left " + this.roomId + " , now this room has " + this.clients.length)
    //appeler service pour rentre les donner de la partie.
  }
  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose () { }
}
