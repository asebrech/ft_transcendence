import { Component, NgModule, OnInit, SimpleChanges} from '@angular/core';
import * as Phaser from 'phaser';
import * as Colyseus from "colyseus.js";
import { Client } from 'colyseus.js';
import { NgModel } from '@angular/forms';
import { recommendCommands } from 'yargs';
import { RouteConfigLoadEnd } from '@angular/router';
import { PlayScene } from '../../services/play.scene.service';

export let room : any;
export let client : Client;



@Component({
  selector: 'app-game.front',
  templateUrl: './game.front.component.html',
  styleUrls: ['./game.front.component.scss'],
})


export class GameFrontComponent implements OnInit
{
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() 
  {}

  ngOnInit()
  {
    client = new Client("ws://localhost:3000");
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

}

