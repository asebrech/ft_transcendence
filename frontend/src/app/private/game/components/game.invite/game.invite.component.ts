import { Component, OnInit } from '@angular/core';
import { StarsService } from 'src/app/services/stars-service/stars.service';
import * as Phaser from 'phaser';
import { Client } from 'colyseus.js';
import { PlayerService } from 'src/app/private/user/services/player.service';
import { UserI, playerHistory } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { InviteScene } from '../../services/invite.scene.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from 'src/app/private/chat/services/chat-service/chat.service';
import { NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

export let room : any;
export let client : Client;
export let inWidth : number;
export let inHeight : number;
export let player_left : boolean;
export let gameWonInvite : boolean;
export let skinPad : string;
export let skinBall : string;
export let opponentPad : string;
export let inviteOpponentName : string;
export let inviteUserEndScore : number;
export let inviteOpponentEndScore : number;
export let invitePlay : boolean = false;

console.warn = () => {};

@Component({
  selector: 'app-game.invite',
  templateUrl: './game.invite.component.html',
  styleUrls: ['./game.invite.component.scss']
})
export class GameInviteComponent implements OnInit {

  inviteScene: Phaser.Game;
  inviteSceneConfig: Phaser.Types.Core.GameConfig;
  gameEnded : boolean;
  notJoined = true;
  checked : boolean = false;
  user : any ;
  username : string;
  realName : string;
  in : boolean = true;
  hasShownAlert : boolean = false;

  constructor(private authService : AuthService, private starsService: StarsService, private playerService : PlayerService, private route : ActivatedRoute, private chatService: ChatService, private router : Router) 
  {
    this.user = this.authService.getLoggedInUser();
    this.username = this.user.id;
    this.realName = this.user.username;
  }

  ngDoCheck()
  {
    room?.onMessage("left_player", ()=>
    {
      player_left = true;
    });
    room?.onMessage("right_player", ()=>
    {
      player_left = false;
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
    room?.onMessage("second_player_found", (message) =>
    {
      this.notJoined = false;
      if (this.notJoined == false && this.in == true)
      {
        this.in = false
        setTimeout(() => {
          this.inviteScene = new Phaser.Game(this.inviteSceneConfig);
        }, 2000);
      }
    })
    room?.onMessage("end", (message) =>
    {
      if (message.winner == true && this.checked == false)
      {
        this.checked = true;
        if (player_left == true)
        {
          inviteOpponentEndScore = message.score.right;
          inviteOpponentName = message.right_username;
          inviteUserEndScore = message.score.left;

          gameWonInvite = true;
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
          inviteOpponentEndScore = message.score.left;
          inviteOpponentName = message.left_username;
          inviteUserEndScore = message.score.right;

          gameWonInvite = false;
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
          inviteOpponentEndScore = message.score.right;
          inviteOpponentName = message.right_username;
          inviteUserEndScore = message.score.left;
          gameWonInvite = false;
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
          inviteOpponentEndScore = message.score.left;
          inviteOpponentName = message.left_username;
          inviteUserEndScore = message.score.right;
          gameWonInvite = true;
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
      invitePlay = true;
      this.inviteScene.destroy(true);
    });

    room?.onMessage("emptyRoom", ()=>
    {
      if (this.hasShownAlert == false && invitePlay == false)
      {
		localStorage.removeItem('hasReloaded');
        window.alert('One of the player disconnected !');
        this.router.navigate(['private/chat']);
        this.hasShownAlert = true;
      }
    });
  }

  ngOnDestroy()
  {
    if(this.in == false)
    {
      room?.leave();
    }
	localStorage.removeItem('hasReloaded');
  }



  ngOnInit(): void
  {
	this.onReload();
    this.route.queryParams.subscribe(params => {
      const functionName = params['functionName'];
      // appeler la fonction en fonction du nom
      if (functionName === 'Create') {
        setTimeout(() => {
          this.create();
        }, 1000);
      }
    });
    this.route.queryParams.subscribe(params => {
      const functionName = params['functionName'];
      const roomId = params['room'];

      // appeler la fonction en fonction du nom
      if (functionName === 'Join') {
        setTimeout(() => {
          this.connect(roomId);
        }, 2000);
      }
    });
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
    ///////////////////////
    gameWonInvite = false;
    this.gameEnded = false;
    inWidth = 1920;
    inHeight = 1080;
    client = new Client("ws://" + location.hostname + ":3001");
    this.inviteSceneConfig = {
      type: Phaser.AUTO,
      scene: [InviteScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game',
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
    this.starsService.setActive(false);
  }

  async create()
  {
    try 
    {
      room = await client?.create("my_room", { rank : this.user.level, numClientsToMatch : 2 , clientId : this.username, padSkin : skinPad, player_name : this.realName});
	    this.chatService.gameRoom.next(room.id);
    } catch (e) {
      console.error("join error", e);
    }  
  }

  async connect(value : string)
  {
    try {
      room = await client?.joinById(value, { rank : this.user.level, numClientsToMatch : 2 , clientId : this.username, padSkin : skinPad, player_name : this.realName});
      this.notJoined = false;
    } catch (e) {
      console.error("join error", e);
    }  
  }
  //////////////////////////////////
  onSubmit(value : string)
  {
    if (!value)
      this.create();
    else
      this.connect(value);
  }

  private onReload() {
	const hasReloaded = localStorage.getItem('hasReloaded');

	// Redirect to a different route if the page has been reloaded
	if (hasReloaded) {
	  localStorage.removeItem('hasReloaded');
	  this.router.navigate(['/private/chat/dashboard']);
	} else {
	  // Set a flag in the localStorage indicating the page has been loaded
	  localStorage.setItem('hasReloaded', 'true');
	}
}
}
