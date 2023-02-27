import { Component, NgModule, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import { Location } from '@angular/common';
import * as Phaser from 'phaser';
import { Client } from 'colyseus.js';
import { PlayScene } from '../../services/play.scene.service';
import { WaitingScene } from '../../services/waiting.play.service';
import { StarsService } from 'src/app/services/stars-service/stars.service';
import { wty } from '../stars-blow/stars.blow/stars.blow.component'

export let room : any;
export let client : Client;

@Component({
  selector: 'app-game.front',
  templateUrl: './game.front.component.html',
  styleUrls: ['./game.front.component.scss'],
})

export class GameFrontComponent implements OnInit, OnDestroy
{
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
  hide : boolean = true;
  constructor(private starsService: StarsService, private location : Location) 
  {}

  ngOnInit()
  {
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
        width: 1050,
        height: 740,
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
        parent: 'gameContainer',
        width: 1310,
        height: 730,
      },
      transparent: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {y : 0, x: 0 }
        }
      }
    };

    // this.playScene = new Phaser.Game(this.playSceneConfig);
    // this.endLoseScene = new Phaser.Game(this.endLoseSceneConfig);
    // this.endWinScene = new Phaser.Game(this.endWinSceneConfig);

  }

  launchWaitingGame()
  {
    if(wty == 1)
    {
      setTimeout(() => {
        this.waitingPlayScene = new Phaser.Game(this.waitingPlaySceneConfig);
        this.hide = false;
      }, 10000);
    }
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

