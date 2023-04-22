import { Component, NgModule, OnDestroy, OnInit, ViewChild, ElementRef, DoCheck} from '@angular/core';
import * as Phaser from 'phaser';
import { Client } from 'colyseus.js';
import { PlayScene } from '../../services/play.scene.service';
import { WaitingScene } from '../../services/waiting.play.service';
import { StarsService } from 'src/app/services/stars-service/stars.service';
import { LaunchGameService } from '../../services/launch.game.service';
import { BehaviorSubject } from 'rxjs';
import { PlayerService } from 'src/app/private/user/services/player.service';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { UserI, playerHistory } from 'src/app/model/user.interface';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/private/chat/services/chat-service/chat.service';
import { thresholdFreedmanDiaconis } from 'd3';

export let room : any;
export let client : Client;
export let inWidth : number;
export let inHeight : number;
export let player_left : boolean;
export let gameWon : boolean;
export let skinPad : string;
export let skinBall : string;
export let opponentPad : string;
export let opponentName : string;
export let opponentEndScore : number;
export let userEndScore : number;
export let frontPlay : boolean = false;


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
  realName : string;
  gameEnded : boolean;
  rank: number;
  history : History;
  hasShownAlert = false;
  hasJoinedSession = false;

  
  constructor(private authService : AuthService, private starsService: StarsService, private launch : LaunchGameService, private playerService : PlayerService,private router: Router, private chatService: ChatService) 
  {
    this.user = this.authService.getLoggedInUser();
    this.username = this.user.id;
    this.rank = this.user.level;
    this.realName = this.user.username;
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
          opponentEndScore = message.score.right;
          opponentName = message.right_username;
          userEndScore = message.score.left;
          console.log(opponentEndScore, opponentName, userEndScore);
          gameWon = true;
          const history : playerHistory = {
            userId: this.user.id,
            opponentId: message.player_right,
            won: true
          }
          this.playerService.setHistory(this.user.id, history).subscribe((user: UserI) => {
          });
        }
        else
        {
          opponentEndScore = message.score.left;
          opponentName = message.left_username;
          userEndScore = message.score.right;
          gameWon = false;
          const history : playerHistory = {
            userId: this.user.id,
            opponentId: message.player_left,
            won: false
          }
          this.playerService.setHistory(this.user.id, history).subscribe((user: UserI) => {
          });
        }
        this.gameEnded = true;
      }
      else if (message.winner == false && this.checked == false)
      {
        this.checked = true;
        if (player_left == true)
        {
          opponentEndScore = message.score.right;
          opponentName = message.right_username;
          userEndScore = message.score.left;
          gameWon = false;
          const history : playerHistory = {
            userId: this.user.id,
            opponentId: message.player_right,
            won: false
          }
          this.playerService.setHistory(this.user.id, history).subscribe((user: UserI) => {
          });
        }
        else
        {
          opponentEndScore = message.score.left;
          opponentName = message.left_username;
          userEndScore = message.score.right;
          gameWon = true;
          const history : playerHistory = {
            userId: this.user.id,
            opponentId: message.player_left,
            won: true
          }
          this.playerService.setHistory(this.user.id, history).subscribe((user: UserI) => {
          });
        }
        this.gameEnded = true;
      }
      frontPlay = true;
      this.playScene.destroy(true);
    });

    room?.onMessage("emptyRoom", ()=>
    {
      if (this.hasShownAlert == false && frontPlay == false)
      {
        window.alert('One of the player disconnected !');
        window.location.reload();
        this.hasShownAlert = true;
      }
    });
  }

  ngOnDestroy()
  {
    if(this.hasJoinedSession == true)
    {
      window.location.reload();
      // room.leave();
    }
	  this.starsService.setActive(true);
  }

  ngOnInit()
  {
    this.playerService.getUser().subscribe((user: UserI) => 
    {
      skinPad = user.colorPad;
      skinBall = user.colorBall;
      if (user.colorPad == 'default' && user.colorBall == 'default')
      {
        skinBall = skinBall + '.png';
        skinPad = skinPad + '.png';
      }
      else if (user.colorPad == 'default')
        skinPad = skinPad + '.png';
      else if (user.colorBall == 'default')
        skinBall = skinBall + '.png';
    });
    gameWon = false;
    ///////////////////////
    this.gameEnded = false;
	  this.starsService.setActive(false);
    ///////////////////////
    inWidth = 1920;
    inHeight = 1080;
    client = new Client("ws://" + location.hostname + ":3001");
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
  async ready()
  {
    room?.send("ready");
  }
  async join()
  {
    try {
      room = await client?.joinOrCreate("ranked",  { rank : this.rank, numClientsToMatch : 2 , clientId : this.username, padSkin : skinPad, player_name : this.realName});
      console.log(room);
      console.log(client.auth);
      this.hasJoinedSession = true;
    } catch (e) {
      console.error("join error", e);
    }  
  }
}

