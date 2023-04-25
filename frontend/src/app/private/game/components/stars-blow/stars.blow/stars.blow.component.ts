import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { LaunchGameService } from '../../../services/launch.game.service';
import { inHeight, inWidth, room } from '../../game.front/game.front.component';

console.warn = () => {};

@Component({
  selector: 'app-stars-blow',
  templateUrl: './stars.blow.component.html',
  styleUrls: ['./stars.blow.component.scss']
})
export class StarsBlowComponent {
  
  constructor(private launch: LaunchGameService) {}

  hide_waiting : number = 0;
  strGame : boolean = true;

  playSound()
  {
    this.hide_waiting = this.launch.hideWaiting(this.hide_waiting);
    this.launch.showButtonOn(1);
    this.strGame = false;
  }
}
