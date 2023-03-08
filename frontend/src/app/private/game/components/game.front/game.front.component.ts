import { Component, NgModule, OnDestroy, OnInit, SimpleChanges, HostListener} from '@angular/core';
import { Location } from '@angular/common';
import * as Phaser from 'phaser';
import { Client } from 'colyseus.js';
import { PlayScene } from '../../services/play.scene.service';
import { WaitingScene } from '../../services/waiting.play.service';
import { StarsService } from 'src/app/services/stars-service/stars.service';
import { LaunchGameService } from '../../services/launch.game.service';
import { threadId } from 'worker_threads';
import { debug } from 'console';

export let room : any;
export let client : Client;
export let inWidth : number;
export let inHeight : number;

@Component({
  selector: 'app-game.front',
  templateUrl: './game.front.component.html',
  styleUrls: ['./game.front.component.scss'],
})

export class GameFrontComponent implements OnInit, OnDestroy
{
  @HostListener('window:resize', ['$event'])

  //////////////////////////////////
  playScene: Phaser.Game;
  playSceneConfig: Phaser.Types.Core.GameConfig;
  ///////////////////////////////////
  waitingPlayScene: Phaser.Game;
  waitingPlaySceneConfig: Phaser.Types.Core.GameConfig;
  //////////////////////////////////
  endWinScene: Phaser.Game;
  endWinSceneConfig: Phaser.Types.Core.GameConfig;
  //////////////////////////////////
  endLoseScene: Phaser.Game;
  endLoseSceneConfig: Phaser.Types.Core.GameConfig;
  //////////////////////////////////
  constructor(private starsService: StarsService, private location : Location, private launch : LaunchGameService) 
  {
  }

  ngOnInit()
  { 
    inWidth = window.innerWidth;
    inHeight = window.innerHeight;  
    console.log(innerWidth)
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
        parent: 'gameContainer',
        width: innerWidth,
        height: innerHeight,
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
        width: innerWidth,
        height: innerHeight,
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
    // this.playScene = new Phaser.Game(this.playSceneConfig);
    // this.endLoseScene = new Phaser.Game(this.endLoseSceneConfig);
    // this.endWinScene = new Phaser.Game(this.endWinSceneConfig);
  }
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

  async throw()
  {
    room?.send("ready");
    this.playScene = new Phaser.Game(this.playSceneConfig);
  }

  async connect(value : string)
  {
    try {
      room = await client?.joinById(value, { });
      console.log(room);
      console.log(client.auth);
    } catch (e) {
      console.error("join error", e);
    }  
  }
  async test()
  {
    try {
      room = await client?.joinOrCreate("my_room", { });
      console.log(room);
      console.log(client.auth);
    } catch (e) {
      console.error("join error", e);
    }  
  }
  ngOnDestroy(): void {
	this.starsService.setActive(true);
  }
}

