import { Room, Client, Server } from "colyseus";
import { matchMaker } from "colyseus";
import { Schema } from "@colyseus/schema";
import * as Phaser from 'phaser';

let player = new Map<string, string>()

interface screen_size
{  
  x : number;
  y : number;
};



export class MyRoom extends Room<Schema> 
{

  rdyPlayer = 2;
  player_left_size : screen_size = {x : 0, y : 0};
  player_right_size : screen_size = {x : 0, y : 0};
  senderScreenRatio = this.player_left_size.x / this.player_left_size.y;
  receiverScreenRatio = this.player_right_size.x / this.player_right_size.y;
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
    {
      player.set(client.sessionId, "player_left");
      try
      {
        client.send("request_left_player_screen");
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
        client.send("request_right_player_screen");
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
        let normalizedX = message.x / this.player_left_size.x;
        let normalizedY = message.y / this.player_left_size.y;
        let scaledX = 0;
        let scaledY = 0;
        scaledX = normalizedX * this.player_right_size.x;
        scaledY = normalizedY * this.player_right_size.y;
        try
        {
          this.clients[1].send("paddle_left", ({x : scaledX, y : scaledY}));
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
        let normalizedX = message.x / this.player_right_size.x;
        let normalizedY = message.y / this.player_right_size.y;
        let scaledX = 0;
        let scaledY = 0;
        scaledX = normalizedX * this.player_left_size.x;
        scaledY = normalizedY * this.player_left_size.y;
        try
        {
          this.clients[0].send("paddle_right", ({x : scaledX, y : scaledY}));
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
          this.clients[1].send("set_ball_position", ({x : message.x, y : message.y}));
        }
        catch 
        {
          console.error("error could not send [set_ball_position]")
        }
      }
    });
    ////////////////////////////////////////
    this.onMessage("player_left_screen_size", (client, message) =>
    {
      if (player.get(client.sessionId) == "player_left")
      {
        this.player_left_size.x = message.x;
        this.player_left_size.y = message.y;
      }
    })
    this.onMessage("player_right_screen_size", (client, message) =>
    {      
      if (player.get(client.sessionId) == "player_right")
      {
        this.player_right_size.x = message.x;
        this.player_right_size.y = message.y;
      }
    })
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
