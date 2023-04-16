import { Injectable } from '@angular/core';
import { PlayScene } from './play.scene.service';
import { WaitingScene } from './waiting.play.service';
import * as Phaser from 'phaser';

@Injectable({
  providedIn: 'root'
})

export class GameService {
  private game: Phaser.Game;
  private botGame: Phaser.Game;
  private playSceneConfig: Phaser.Types.Core.GameConfig;
  private waitingPlaySceneConfig: Phaser.Types.Core.GameConfig;
  private inWidth : number = 1920;
  private inHeight : number = 1080;

  constructor() {
    
    this.playSceneConfig = {
      type: Phaser.AUTO,
      scene: [PlayScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'gameContainer',
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
    /////////////////INIT WAITING PLAY SCENE CONFIG/////////////////
    this.waitingPlaySceneConfig = {
      type: Phaser.AUTO,
      scene: [WaitingScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        // parent: 'gameContainer',
        width: this.inWidth,
        height: this.inHeight,
      },
      transparent: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {y : 0, x: 0 }
        }
      }
    };
  }
  
  getGame(): Phaser.Game {
    return this.game;
  }
  getBotGame()
  {
    this.botGame = new Phaser.Game(this.waitingPlaySceneConfig);
    // return this.botGame;
  }
}
