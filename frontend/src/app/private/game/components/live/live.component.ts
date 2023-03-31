import { Component, DoCheck, OnInit } from '@angular/core';
import { client } from '../game.front/game.front.component';
import { StarsService } from 'src/app/services/stars-service/stars.service';
import { LaunchGameService } from '../../services/launch.game.service';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})

export class LiveComponent implements OnInit, DoCheck {

  constructor(private starsService: StarsService, private launch : LaunchGameService) { }
  rooms : any;
  // myArray: { roomId: string, player_left: string, player_right : string, score_left : number, score_right : number }[] = [];    
  

  ngDoCheck() 
  {
  }
  
  ngOnInit()
  {
    this.starsService.setActive(false);
  }
  
  getAvailableRooms()
  {
  }

}
