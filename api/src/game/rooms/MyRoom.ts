import { Room, Client, Server } from "colyseus";
import { matchMaker } from "colyseus";
import { Schema } from "@colyseus/schema";
import { IncomingMessage } from "http";

let player = new Map<string, string>()

export class MyRoom extends Room<Schema> 
{
  right_player : string;
  left_player : string;
  right_score : number = 0;
  left_score : number = 0;
  rdyPlayer = 2;
  playing : number = 2;
  right_player_skin : string;
  left_player_skin : string;
  right_player_username : string;
  left_player_username : string;


  constructor() {
    super();

    // Set autoDispose to true
    this.autoDispose = true;
  }
  // When room is initialized
  onCreate (options: any) 
  {
    this.setSeatReservationTime(10000);
    console.log("room " + this.roomId + " created successfully , playerId : ", options.clientId);
  }

  // onAuth(client: Client, options: any, request?: IncomingMessage) 
  // {
  //   this.setSeatReservationTime(60);
  //   return true;
  // }

  // When client successfully join the room
  onJoin (client: Client, options: any, auth: any) 
  {
    if (this.clients.length == 1)
    {
      try
      {
        this.left_player = options.clientId;
        this.left_player_username = options.player_name;
        client.send("left_player");
        this.left_player_skin = options.padSkin;
      }
      catch
      {
        console.error("error could not send [request_left_player_screen]")
      }
      player.set(client.sessionId, "player_left");
    }
    else if (this.clients.length == 2)
    {
      try
      {
        this.right_player = options.clientId;
        this.right_player_username = options.player_name;
        client.send("right_player");
        this.right_player_skin = options.padSkin;
      }
      catch
      {
        console.error("error could not send [request_right_player_screen]")
      }
      player.set(client.sessionId, "player_right");
      this.broadcast("right_player_skin", this.right_player_skin);
      this.broadcast("left_player_skin", this.left_player_skin);
	  this.broadcast("second_player_found", ({player_left_id : this.left_player, player_right_id : this.right_player}));
      console.log("LES DEUX JOUEURS DANS LA ROOM PLAYER_LEFT : " + this.left_player + " ET LE PLAYER_RIGHT " + this.right_player);
    }
    else
      player.set(client.sessionId, "spectator");
    ///////////////////////////////////////////
    console.log(client.sessionId + " is connected to " + this.roomId + " , now this room has " + player.get(client.sessionId))
    
    ///////////////////////////////////////////
    this.onMessage("move_left_pad", (client, message) =>
    {
      if (player.get(client.sessionId) == "player_left" || player.get(client.sessionId) == "spectator")
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
      if (player.get(client.sessionId) == "player_right" || player.get(client.sessionId) == "spectator")
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
      if (player.get(client.sessionId) == "player_left" || player.get(client.sessionId) == "spectator")
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
    this.onMessage("collision", (client, message) =>
    {
      this.broadcast("collisionSound");
    });
    this.onMessage("game_finished", (client, message)=>
    {
      this.broadcast("end", ({player_left : this.left_player, player_right : this.right_player, score : {right : this.right_score, left : this.left_score}, winner : message.winner, left_username : this.left_player_username, right_username : this.right_player_username}));
    });
    this.onMessage("score_update", (client , message) =>
    {
      this.left_score = message.score_left;
      this.right_score = message.score_right;
      this.broadcast("updated_score", ({s_l : this.left_score, s_r : this.right_score}));
      this.setMetadata({player_left : this.left_player, player_right : this.right_player, score : {right : this.right_score, left : this.left_score}})
    });
    this.setMetadata({player_left : this.left_player, player_right : this.right_player, score : {right : this.right_score, left : this.left_score}, left_username : this.left_player_username, right_username : this.right_player_username})
  }

  // When a client leaves the room
  onLeave (client: Client, consented: boolean) 
  {
    if (player.get(client.sessionId) == "player_right" || player.get(client.sessionId) == "player_left")
    {
      this.broadcast("emptyRoom");
      for (const client of this.clients) {
        this.disconnectClient(client);
      }
    }
    else
    {
      client.leave();
    }
    console.log(client.sessionId + " left " + this.roomId + " , now this room has " + this.clients.length)
  }
  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose () 
  {
  }
  
  disconnectClient(client: Client) 
  {
    client.leave()
    player.delete(client.sessionId);
    console.log("LE JOUEUR ID " + this.left_player + " A QUITTER LA PARTIE");
    console.log("LE JOUEUR ID " + this.right_player + " A QUITTER LA PARTIE");
  }
}