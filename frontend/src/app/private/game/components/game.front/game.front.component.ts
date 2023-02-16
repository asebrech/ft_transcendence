import { Component, OnInit} from '@angular/core';
import * as Phaser from 'phaser';
import { PlayScene } from '../../services/play.scene.service'
import * as Colyseus from "colyseus.js";


@Component({
  selector: 'app-game.front',
  templateUrl: './game.front.component.html',
  styleUrls: ['./game.front.component.scss'],
})


export class GameFrontComponent
{
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;
  client : any;
  player : any = {};

  constructor() {
    this.client = new Colyseus.Client("ws://localhost:3000");


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

  async test()
  {
    try {
      const room = await this.client.joinOrCreate("my_room", {/* options */});
      console.log("joined successfully", room);
      this.phaserGame = new Phaser.Game(this.config);
    
    } catch (e) {
      console.error("join error", e);
    }  
  }

  cli()
  {
    this.client.getAvailableRooms("battle").then(rooms => {
      rooms.forEach((room) => {
        console.log(room.roomId);
        console.log(room.clients);
        console.log(room.maxClients);
        console.log(room.metadata);
      });
    }).catch(e => {
      console.error(e);
    });
  }
  
 

  // ngOnInit() 
  // {
  //   this.phaserGame = new Phaser.Game(this.config);
  // }

}