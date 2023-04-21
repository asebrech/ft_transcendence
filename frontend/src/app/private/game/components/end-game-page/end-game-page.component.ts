import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StarsService } from 'src/app/services/stars-service/stars.service';
import { gameWon } from '../game.front/game.front.component';
import { gameWonInvite } from '../game.invite/game.invite.component';

@Component({
  selector: 'app-end-game-page',
  templateUrl: './end-game-page.component.html',
  styleUrls: ['./end-game-page.component.scss']
})
export class EndGamePageComponent implements OnInit {

  constructor(private starsService: StarsService) 
  {
    this.starsService.setActive(false);
  }

  WonGame : boolean = false;
  LostGame : boolean = false;

  resultLose : string = "YOU LOSE !";
  resultWin : string = "YOU WIN !";
  you : string = "TATA";
  opponent : string = "TOTO";
  level : number = 0;
  your_score : number = 4;
  opponent_score : number = 10;

  @ViewChild('progressBar', { static: false }) xpBar!: ElementRef;
  @ViewChild('degressBar', { static: false }) degBar!: ElementRef;

  ngAfterViewInit() 
  {
    if (this.WonGame == true && this.xpBar)
    {
      this.xpBar.nativeElement.addEventListener('animationend', () => {
          this.level++;
        });    
      };
      if (this.LostGame == true)
      {
        this.degBar.nativeElement.addEventListener('animationend', () => {
          if (this.level != 1)
            this.level--;
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
  }
}
