import { Component, DoCheck, OnInit } from '@angular/core';
import { StarsService } from 'src/app/services/stars-service/stars.service';
import { LaunchGameService } from '../../services/launch.game.service';
import { Client } from 'colyseus.js';
import { LiveScene } from '../../services/live.scene.service';

export let room : any;

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})

export class LiveComponent implements OnInit, DoCheck {

  constructor(private starsService: StarsService, private launch : LaunchGameService) { }
  // rooms : any;
  client : Client;
  roomIds: string[] = [];
  myArray: { 
    roomId: string, 
    player_left: string, 
    player_right : string, 
    score_left : number, 
    score_right : number 
  }[] = [];    
  showGame : number;
  showLive : number;
  inWidth : number = 1920;
  inHeight : number = 1080;
  liveScene: Phaser.Game;
  liveSceneConfig: Phaser.Types.Core.GameConfig;


  ngDoCheck() 
  {
    room?.onMessage("end", () =>
    {
      this.liveScene.destroy(true);
    });

  }
  
  async ngOnInit()
  {
    this.showLive = 1;
    this.showGame = 0;
    this.client = new Client("ws://" + location.hostname + ":3000");
    this.liveSceneConfig = {
      type: Phaser.AUTO,
      scene: [LiveScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'liveScreen',
        width: this.inWidth,
        height:  this.inHeight,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {y : 0, x: 0 }
        }
      }
    };

    this.getAvailableRooms();
    this.starsService.setActive(false);    
  }
  
  async getAvailableRooms()
  {
    const rooms = await this.client.getAvailableRooms("my_room");
    if(rooms.length > 0)
    {
      console.log("test");
      for (let i : number = 0 ; i < rooms.length; i++)
      {
        console.log("myRoom")
        const metadata = rooms[i].metadata;
        this.myArray.push({
          roomId: rooms[i].roomId,
          player_left: metadata.player_left,
          player_right: metadata.player_right,
          score_left: metadata.score.left,
          score_right: metadata.score.right
        });
      };
    }
  };

  async joinLive(roomId : any)
  {
    try {
      room = await this.client?.joinById(roomId, { });
      this.liveScene = new Phaser.Game(this.liveSceneConfig);
      console.log(room);
    } catch (e) {
      console.error("join error", e);
    }  
  }
}


