import { Component, NgModule, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import * as Phaser from 'phaser';
import * as Colyseus from "colyseus.js";
import { Client } from 'colyseus.js';
import { NgModel } from '@angular/forms';
import { recommendCommands } from 'yargs';
import { RouteConfigLoadEnd } from '@angular/router';
import { PlayScene } from '../../services/play.scene.service';

export let room : any;
export let client : Client;
import { StarsService } from 'src/app/services/stars-service/stars.service';



@Component({
  selector: 'app-game.front',
  templateUrl: './game.front.component.html',
  styleUrls: ['./game.front.component.scss'],
})


export class GameFrontComponent implements OnInit, OnDestroy
{
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor(private starsService: StarsService) 
  {}

  ngOnInit()
  {
    client = new Client("ws://localhost:3000");

	//background
	this.starsService.setActive(false);

    this.client = new Colyseus.Client("ws://localhost:3000");
    // room = this.client.joinOrCreate("my_room", {/* options */});

    this.config = {
      type: Phaser.AUTO,
      scene: [PlayScene],
      scale: {
        mode: Phaser.Scale.FIT,
        parent: 'gameContainer',
        height: 694,
        width: 950,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {y : 0, x: 0 }
        }
      }
    };
  }
  async throw()
  {
    room?.send("ready");
    this.phaserGame = new Phaser.Game(this.config);
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

