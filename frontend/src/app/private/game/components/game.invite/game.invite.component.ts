import { Component, OnInit } from '@angular/core';
import { StarsService } from 'src/app/services/stars-service/stars.service';
import * as Phaser from 'phaser';
import { Client } from 'colyseus.js';
import { PlayerService } from 'src/app/private/user/services/player.service';
import { UserI } from 'src/app/model/user.interface';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { join } from 'path';
import { InviteScene } from '../../services/invite.scene.service';

export let room : any;
export let client : Client;
export let inWidth : number;
export let inHeight : number;
export let player_left : boolean;
export let gameWon : boolean;
export let skinPad : string;
export let skinBall : string;
export let opponentPad : string;

@Component({
  selector: 'app-game.invite',
  templateUrl: './game.invite.component.html',
  styleUrls: ['./game.invite.component.scss']
})
export class GameInviteComponent implements OnInit {

  playScene: Phaser.Game;
  playSceneConfig: Phaser.Types.Core.GameConfig;
  gameEnded : boolean;
  notJoined = true;
  user : any ;
  username : string;
  in : boolean;

  constructor(private authService : AuthService, private starsService: StarsService, private playerService : PlayerService) 
  {
    this.user = this.authService.getLoggedInUser();
    this.username = this.user.id;
  }

  ngDoCheck()
  {
    room?.onMessage("left_player", ()=>
    {
      player_left = true;
    });
    room?.onMessage("right_player", ()=>
    {
      player_left = false;
    });
    if (player_left == true)
    {
      room?.onMessage("right_player_skin", (message) =>
      {
        opponentPad = message;
      })
    }
    if (player_left == false)
    {
      room?.onMessage("left_player_skin", (message) =>
      {
        opponentPad = message;
      })
    }
    room?.onMessage("second_player_found", () =>
    {
      if (this.notJoined == false && this.in == true)
      {
        console.log("1");
        this.in = false
        setTimeout(() => {
          this.playScene = new Phaser.Game(this.playSceneConfig);
        }, 2000);
      }
    })
    room?.onMessage("end", (message) =>
    {
      if (message.winner == true)
      {
        if (player_left == true)
          gameWon = true;
        else
          gameWon = false;
        this.gameEnded = true;
      }
      else if (message.winner == false)
      {
        if (player_left == true)
          gameWon = false;
        else
          gameWon = true;
        this.gameEnded = true;
      }
      this.playScene.destroy(true);
    });
  }


  ngOnInit(): void
  {
    gameWon = false;
    ///////////////////////
    this.gameEnded = false;
    this.playerService.getUser().subscribe((user: UserI) => {
      skinPad = user.colorPad;
      skinBall = user.colorBall;
    });
    inWidth = 1920;
    inHeight = 1080;
    client = new Client("ws://" + location.hostname + ":3000");
    this.playSceneConfig = {
      type: Phaser.AUTO,
      scene: [InviteScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game',
        width: inWidth,
        height:  inHeight,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {y : 0, x: 0 }
        }
      }
    };
    this.starsService.setActive(false);
  }

  async create()
  {
    try 
    {
      room = await client?.create("my_room", { rank : 10, numClientsToMatch : 2 , clientId : this.username, padSkin : skinPad});
      console.log(room);
      console.log(client.auth);
      this.notJoined = false;
      console.log(this.notJoined);
    } catch (e) {
      console.error("join error", e);
    }  
  }

  async connect(value : string)
  {
    try {
      room = await client?.joinById(value, { rank : 10, numClientsToMatch : 2 , clientId : this.username, padSkin : skinPad});
      console.log(room);
      console.log(client.auth);
      this.notJoined = false;
      console.log(this.notJoined);
    } catch (e) {
      console.error("join error", e);
    }  
  }
  onSubmit(value : string)
  {
    if (!value)
      this.create();
    else
      this.connect(value);
  }
}
