import { Element } from '@angular/compiler';
import { ElementRef, Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class BallService {

  x : number;
  y : number;
  ballElem : HTMLElement;
  constructor(ball : HTMLElement) 
  {
    this.ballElem = ball;
  }
  get_x() : number
  {
    return +this.ballElem.style.getPropertyValue('left').toString();
  }
  set_x(value: number)
  {
    this.ballElem.style.setProperty('left', 'calc' + value.toString() +' * 1vw)');
  }
  get_y() : number
  {
    return +this.ballElem.style.getPropertyValue('top').toString();
  }
  set_y(value: number)
  {
    this.ballElem.style.setProperty('top', 'calc' + value.toString() +' * 1vh)');
  } 

}
