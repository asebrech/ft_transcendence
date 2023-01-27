import { Component, OnInit, HostListener, ElementRef , ViewChild, Renderer2, AfterViewInit} from '@angular/core';
import { BallService } from '../../services/ball/ball.service';
@Component({
  selector: 'app-game.front',
  templateUrl: './game.front.component.html',
  styleUrls: ['./game.front.component.scss']
})


export class GameFrontComponent implements AfterViewInit
{
  @ViewChild('pad', { static: true }) pad: ElementRef | any;
  
  lastTime: any;
  // ball : BallService =  new BallService(document.querySelector('.ball'));
  time: Date;

  constructor(private renderer: Renderer2) 
  {
  }

  player_pad : string = ".p_2.right"
  ngAfterViewInit() 
  {
    this.pad = document.querySelector(this.player_pad);    
  }

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