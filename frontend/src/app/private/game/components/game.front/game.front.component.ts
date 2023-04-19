import { Component, NgModule, OnDestroy, OnInit, ViewChild, ElementRef, DoCheck} from '@angular/core';
import { Location } from '@angular/common';
import * as Phaser from 'phaser';
import { Client } from 'colyseus.js';
import { PlayScene } from '../../services/play.scene.service';
import { WaitingScene } from '../../services/waiting.play.service';
import { StarsService } from 'src/app/services/stars-service/stars.service';
import { LaunchGameService } from '../../services/launch.game.service';
import { BehaviorSubject, async } from 'rxjs';
import { GameService } from '../../services/game.service';
import { PlayerService } from 'src/app/private/user/services/player.service';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { UserI, playerHistory } from 'src/app/model/user.interface';
import { map } from 'jquery';

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
  checked : boolean = false;
  connected = false;
  joinedVar = new BehaviorSubject<boolean> (this.joined);
  botGameLaunched = false;
  user : any ;
  username : string;
  gameEnded : boolean;
  rank: number;
  history : History;

  
  constructor(private authService : AuthService, private starsService: StarsService, private launch : LaunchGameService, private playerService : PlayerService) 
  {
    this.user = this.authService.getLoggedInUser();
    this.username = this.user.id;
    this.rank = this.user.level;
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
    };
    room?.onMessage("left_player", ()=>
    {
      player_left = true;
    });
    room?.onMessage("right_player", ()=>
    {
      player_left = false;
    });
    room?.onMessage("seat", (message) => 
    {
      this.joinGameSession(message.ticket);
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
      this.joinedVar.subscribe((value) =>
      {
        if (value == true && this.in == 0)
        {
          if (this.botGameLaunched == false)
          {
            this.addButtonStatus(0);
            this.launch.launchGame();
          }
          this.launch.gameFound();
          if(this.botGameLaunched == true)
            this.waitingPlayScene.destroy(true, false);
          setTimeout(() => {
            this.playScene = new Phaser.Game(this.playSceneConfig);
          }, 2000);
          this.in += 1;
        }
      });
    })
    room?.onMessage("end", (message) =>
    {
      if (message.winner == true && this.checked == false)
      {
        this.checked = true;
        if (player_left == true)
        {
          gameWon = true;
          const history : playerHistory = {
            userId: this.user.id,
            opponentId: message.player_right,
            won: true
          }
          this.playerService.setHistory(this.user.id, history).subscribe((user: UserI) => {
            console.log("match added to history successfully", user.history);
          });
          this.playerService.incrLevel(this.user.id).subscribe(response => { console.log("level incred");});
          this.playerService.addWin(this.user.id).subscribe();
        }
        else
        {
          gameWon = false;
          const history : playerHistory = {
            userId: this.user.id,
            opponentId: message.player_left,
            won: false
          }
          this.playerService.setHistory(this.user.id, history).subscribe((user: UserI) => {
            console.log("match added to history successfully", user.history);
          });
          this.playerService.decrLevel(this.user.id).subscribe(response => { console.log("level decred");});
          this.playerService.addLosses(this.user.id).subscribe();
        }
        this.gameEnded = true;
      }
      else if (message.winner == false && this.checked == false)
      {
        this.checked = true;
        if (player_left == true)
        {
          gameWon = false;
          const history : playerHistory = {
            userId: this.user.id,
            opponentId: message.player_right,
            won: false
          }
          this.playerService.setHistory(this.user.id, history).subscribe((user: UserI) => {
            console.log("match added to history successfully", user.history);
          });
          this.playerService.decrLevel(this.user.id).subscribe(response => { console.log("level decred");});
          this.playerService.addLosses(this.user.id).subscribe();
        }
        else
        {
          gameWon = true;
          const history : playerHistory = {
            userId: this.user.id,
            opponentId: message.player_left,
            won: true
          }
          this.playerService.setHistory(this.user.id, history).subscribe((user: UserI) => {
            console.log("match added to history successfully", user.history);
          });
          this.playerService.incrLevel(this.user.id).subscribe(response => { console.log("level incred");});
          this.playerService.addWin(this.user.id).subscribe();
        }
        this.gameEnded = true;
      }
      this.playScene.destroy(true);
    });
  }

  ngOnInit()
  {
    this.playerService.getUser().subscribe((user: UserI) => {
      skinPad = user.colorPad;
      skinBall = user.colorBall;
    });
    gameWon = false;
    ///////////////////////
    this.gameEnded = false;
	  this.starsService.setActive(false);
    ///////////////////////
    // let audio = new Audio()
    // audio.src = "../../../../assets/background.wav";
    // audio.load();
    // audio.play();
    //////////////////////
    inWidth = 1920;
    inHeight = 1080;
    client = new Client("ws://" + location.hostname + ":3000");
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
          // debug: true,
          gravity: {y : 0, x: 0 }
        }
      }
    };
  }

  async joinGameSession(ticket) 
  {
    try 
    {
      room = await client?.consumeSeatReservation(ticket);
    } catch (error) 
    {
      console.log('Failed to join game session:', error);
    }
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
    this.launch.showButtonOn(nbr);
  }
  callButtonStatus()
  {
    return this.launch.showButtonStats();
  }
  launchBotPlay()
  {
    this.botGameLaunched = true;
    this.addButtonStatus(0);
    this.launch.launchGame();
    this.IfGameFound();
    if (this.checkIfGameFoundRet)
    {
      setTimeout(() => {
        this.waitingPlayScene = new Phaser.Game(this.waitingPlaySceneConfig);
      }, 1000);
    }
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
      // TODO : USERNAME EST UNDEFINED /// RAJOUTER LE RANK PAR DEFAUT 10
      room = await client?.joinOrCreate("ranked",  { rank : this.rank, numClientsToMatch : 2 , clientId : this.username, padSkin : skinPad});
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
  test()
  {
    this.addButtonStatus(0);
    this.launch.launchGame();  
    this.launch.gameFound();
    setTimeout(() => {
      this.waitingPlayScene = new Phaser.Game(this.waitingPlaySceneConfig);
    }, 2000);

  }
}

