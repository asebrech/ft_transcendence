import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StarsService } from 'src/app/services/stars-service/stars.service';
import { gameWon, opponentName, opponentEndScore, userEndScore, frontPlay} from '../game.front/game.front.component';
import { gameWonInvite, inviteOpponentName , inviteOpponentEndScore, inviteUserEndScore, invitePlay} from '../game.invite/game.invite.component';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { Client } from 'colyseus.js';
import { PlayerService } from 'src/app/private/user/services/player.service';
import { UserI } from 'src/app/model/user.interface';
@Component({
  selector: 'app-end-game-page',
  templateUrl: './end-game-page.component.html',
  styleUrls: ['./end-game-page.component.scss']
})
export class EndGamePageComponent implements OnInit {

  userAuth : any ;
  ////////////////////
  you : string;
  opponent : string;
  ////////////////////
  level : number;
  ////////////////////
  your_score : number = 0;
  opponent_score : number = 0;

  constructor(private authService : AuthService, private starsService: StarsService, private playerService : PlayerService) 
  {
    this.starsService.setActive(false);
    this.userAuth = this.authService.getLoggedInUser();
    this.you = this.userAuth.username;
  }

  WonGame : boolean = false;
  LostGame : boolean = false;

  resultLose : string = "YOU LOSE !";
  resultWin : string = "YOU WIN !";

  @ViewChild('progressBar', { static: false }) xpBar!: ElementRef;
  @ViewChild('degressBar', { static: false }) degBar!: ElementRef;

  ngAfterViewInit() 
  {
    if (invitePlay == true)
    {          
      setTimeout(() => {
      this.opponent = inviteOpponentName;
      this.opponent_score = inviteOpponentEndScore;
      this.your_score = inviteUserEndScore;
      }, 0);
    }
    if (frontPlay == true)
    {
      setTimeout(() => {
      this.opponent = opponentName;
      this.opponent_score = opponentEndScore;
      this.your_score = userEndScore;
      }, 0);
    }
    if (this.WonGame == true && this.xpBar)
    {
      this.playerService.incrLevel(this.userAuth.id).subscribe((user: UserI) => {
         this.level = user.level;
        });
      this.playerService.addWin(this.userAuth.id).subscribe();
      this.xpBar.nativeElement.addEventListener('animationend', () => 
      {
      });
    };

    if (this.LostGame == true)
    {
      this.playerService.decrLevel(this.userAuth.id).subscribe((user: UserI) => {
      this.level = user.level;
      });
      this.playerService.addLosses(this.userAuth.id).subscribe();
      this.degBar.nativeElement.addEventListener('animationend', () => 
      {
      });
    };

    this.starsService.setActive(true);
  }

  ngOnInit(): void 
  {
    if (gameWon == true || gameWonInvite == true)
    {
      this.WonGame = true;
    }
    else 
    {
      this.LostGame = true;
    }

    this.playerService.getUser().subscribe((user:UserI) => { this.level = user.level;})
  }
  
  goBack()
  {
    window.location.reload();
  }

  async opponnentInfo()
  {
    let myClient = new Client("ws://" + location.hostname + ":3001");
    const rooms = await myClient.getAvailableRooms("my_room");
    if(rooms.length > 0)
    {
      for (let i : number = 0 ; i < rooms.length; i++)
      {
        const metadata = rooms[i].metadata;
        console.log(rooms[i].roomId);
        console.log("left_username : ",metadata.left_username);
        console.log("right_username : ",metadata.right_username);
        console.log("right_user_id : ", metadata.player_left);
        console.log("left_user_id : ", metadata.player_right);
        console.log(metadata.score.left);
        console.log(metadata.score.right);
      };
    }
  }

}
