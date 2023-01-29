import { Component, OnInit, HostListener, ElementRef , ViewChild, Renderer2, AfterViewInit} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BallService } from '../../services/ball/ball.service';
// Animation of the ball
const gameStart = trigger('gameStart', [
  state('open', style({
    left : 'calc(42 * 1vw)',
  })),
  state('close', style({
    left : "calc(44 * 1vw)",
  })),
  transition('open => close', [animate('10s')]),
  transition('close => open', [animate('0s')]),
]);
//

@Component({
  selector: 'app-game.front',
  templateUrl: './game.front.component.html',
  styleUrls: ['./game.front.component.scss'],
  animations: [gameStart]
})

export class GameFrontComponent implements AfterViewInit
{
  constructor(private renderer: Renderer2) 
  {
    
  }
  ball : BallService = new BallService(document.querySelector('Ball'));
  //--------------//
  isShown = false;
  start(): void {
    this.isShown = !this.isShown;
  }
  //--------------//

  //--------------//
  @ViewChild('pad', { static: true }) pad: ElementRef | any;
  player_pad : string = ".p_2.right"
  //--------------//

  ngAfterViewInit() 
  {
    this.pad = document.querySelector(this.player_pad);    
  }

  //--------------//
  value: number = 42;

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) 
  {
    if (event.key === 'ArrowUp') 
    {
      this.value -= 1;
      this.renderer.setStyle(this.pad, 'top', this.value.toString()+'vh');    
    
    }
    if (event.key === 'ArrowDown') 
    {
      this.value += 1;
      this.renderer.setStyle(this.pad, 'top', this.value.toString()+'vh');    
    }
  }

}