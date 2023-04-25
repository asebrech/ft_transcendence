import { Component, DoCheck, OnInit, ɵɵqueryRefresh } from '@angular/core';
import { StarsService } from 'src/app/services/stars-service/stars.service';
import { LaunchGameService } from '../../services/launch.game.service';
import { Client } from 'colyseus.js';
import { LiveScene } from '../../services/live.scene.service';
import { ChatService } from 'src/app/private/chat/services/chat-service/chat.service';

export let room : any;

console.warn = () => {};

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})

export class LiveComponent implements OnInit, DoCheck {

  constructor(private starsService: StarsService, private launch : LaunchGameService, private chatService: ChatService) { }
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
  watchingLive : boolean;
  screen : boolean;


  ngDoCheck() 
  {
    room?.onMessage("end", () =>
    {
      this.liveScene.destroy(true);
      this.screen = false;
      this.watchingLive = true;
    });
    room?.onMessage("emptyRoom", () =>
    {
      this.liveScene.destroy(true);
      this.screen = false;
      this.watchingLive = true;
    });
  }
  
  async ngOnInit()
  {

    this.screen = false;
    this.watchingLive = true;
    this.showLive = 1;
    this.showGame = 0;
    this.client = new Client("ws://" + location.hostname + ":3001");
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
	this.chatService.getInGame().subscribe (() => {
		this.getAvailableRooms()
	})

	this.chatService.getEndGame().subscribe (() => {
		this.getAvailableRooms()
	})
  }
  
  async getAvailableRooms()
  {
    const rooms = await this.client.getAvailableRooms("my_room");
	this.myArray = [];
    if(rooms.length > 0)
    {
      for (let i : number = 0 ; i < rooms.length; i++)
      {
        const metadata = rooms[i].metadata;
        this.myArray.push({
          roomId: rooms[i].roomId,
          player_left: metadata.left_username,
          player_right: metadata.right_username,
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
        this.screen = true;
        this.watchingLive = false;
        setTimeout(() => {
          this.liveScene = new Phaser.Game(this.liveSceneConfig);
        }, 2000);
      } catch (e) {
        window.alert("You can't join this room because game is finished");
      }  
  }
  refresh()
  {
    this.getAvailableRooms();
  }
}



