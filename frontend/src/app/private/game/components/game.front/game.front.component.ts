import { Component, NgModule, OnDestroy, OnInit, SimpleChanges, HostListener, OnChanges, Input, DoCheck} from '@angular/core';
import { Location } from '@angular/common';
import * as Phaser from 'phaser';
import { Client } from 'colyseus.js';
import { PlayScene } from '../../services/play.scene.service';
import { WaitingScene } from '../../services/waiting.play.service';
import { StarsService } from 'src/app/services/stars-service/stars.service';
import { LaunchGameService } from '../../services/launch.game.service';
import { BehaviorSubject } from 'rxjs';

export let room : any;

export let client : Client;
export let inWidth : number;
export let inHeight : number;
export let player_left : boolean;

@Component({
  selector: 'app-game.front',
  templateUrl: './game.front.component.html',
  styleUrls: ['./game.front.component.scss'],
})

export class GameFrontComponent implements OnInit, DoCheck
{
  //////////////////////////////////
  playScene: Phaser.Game;
  playSceneConfig: Phaser.Types.Core.GameConfig;
  ///////////////////////////////////
  waitingPlayScene: Phaser.Game;
  waitingPlaySceneConfig: Phaser.Types.Core.GameConfig;
  ///////////////////////////////////
  joined = false;
  in = 0;
  joinedVar = new BehaviorSubject<boolean> (this.joined);

  constructor(private starsService: StarsService, private location : Location, private launch : LaunchGameService) 
  {
  }

  ngDoCheck() 
  {
    if (this.launch.showButtonStats() == 1)
    {
      if (this.joined == false)
      {
        this.join()
        this.joined = true;
        this.joinedVar.next(this.joined);
      }
    }
    room?.onMessage("request_left_player_screen", ()=>
    {
      player_left = true;
      room?.send("player_left_screen_size", ({x : inWidth, y : inHeight}));
    })
    room?.onMessage("request_right_player_screen", ()=>
    {
      player_left = false;
      room?.send("player_right_screen_size", ({x : inWidth, y : inHeight}));
    })
    room?.onMessage("second_player_found", () =>
    {
      this.joinedVar.subscribe((value) =>
      {
        if (value == true && this.in == 0)
        {
          this.launch.gameFound();
          this.addButtonStatus(0);
          this.launch.launchGame();
          this.playScene = new Phaser.Game(this.playSceneConfig);
          this.in += 1;
        }
      });
    })
  }

  ngOnInit()
  {
    inWidth = 1920;
    inHeight = 1080;
    ////////////////BACKGROUND ANIMATION SET TO FALSE//////////////
	  this.starsService.setActive(false);
    /////////////////INIT PLAYER SESSION//////////////////////////
    client = new Client("ws://" + location.hostname + ":3000");
    /////////////////INIT PLAY SCENE CONFIG///////////////////////
    this.playSceneConfig = {
      type: Phaser.AUTO,
      scene: [PlayScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'gameContainer',
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
    /////////////////INIT WAITING PLAY SCENE CONFIG/////////////////
    this.waitingPlaySceneConfig = {
      type: Phaser.AUTO,
      scene: [WaitingScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'gameContainer',
        width: inWidth,
        height: inHeight,
      },
      transparent: true,
      physics: {
        default: 'arcade',
        arcade: {
          debug: true,
          gravity: {y : 0, x: 0 }
        }
      }
    };    
  }
  IfGameFound()
  {
    this.launch.gameFound();
  }
  checkIfGameFoundRet()
  {
    return this.launch.gameFoundRet();
  }
  ///////////////////////////////////////
  addButtonStatus(nbr : number)
  {
    //////THIS BUTTON HAS 2 STATS///////
    //////0 = button not shown//////////
    //////1 =  button shown ////////////
    this.launch.showButtonOn(nbr);
  }
  callButtonStatus()
  {
    return this.launch.showButtonStats();
  }

  launchBotPlay()
  {
    this.addButtonStatus(0);
    this.launch.launchGame();
    this.IfGameFound();
    this.waitingPlayScene = new Phaser.Game(this.waitingPlaySceneConfig);
  }
  switchToBotPlay()
  {
    if (this.launch.launchGameRet() == 1)
    {
      return 0;
    }
    return 1;
  }
  ////////////////////////////////////////////////
  async ready()
  {
    room?.send("ready");
  }
  async join()
  {
    try {
      room = await client?.joinOrCreate("my_room", { });
      console.log(room);
      console.log(client.auth);
    } catch (e) {
      console.error("join error", e);
    }  
  }
  async connect(value : string)
  {
    try {
      room = await client?.joinById(value, { });
      this.playScene = new Phaser.Game(this.playSceneConfig);
      console.log(room);
      console.log(client.auth);
    } catch (e) {
      console.error("join error", e);
    }  
  }
  ///////////////////////////////////////////////
  ngOnDestroy(): void {
	this.starsService.setActive(true);
  }
}

