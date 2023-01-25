import { Element } from '@angular/compiler';
import { ElementRef, Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class BallService{

  INITIAL_VELOCITY: number = .025;
  VELOCITY_INCREASE: number = .0001;
  ballElem: ElementRef<any>;
  renderer: Renderer2;
  direction: any;
  velocity: number;

  constructor() 
  { 
  }
  // get x()
  // {
  //   return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
  // }
  // set x(value)
  // {
  //   this.renderer.setStyle(this.ballElem, '--x', value);
  // }
  // get y()
  // {
  //   return  parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
  // }
  // set y(value)
  // {
  //   this.renderer.setStyle(this.ballElem, '--y', value);
  // }
  // rect()
  // {
  //   return this.ballElem.getBoundingClientRect();
  // }
  // reset()
  // {
  //   this.x = 50;
  //   this.y = 50;
  //   this.direction = {x: 0};
  //   while(Math.abs(this.direction.x) <= .2 || Math.abs(this.direction.x) >= .9)
  //   {
  //       const heading = this.randomNumberBetween(0, 2 * Math.PI);
  //       this.direction = {x: Math.cos(heading), y: Math.sin(heading)}
  //   }
  //   this.velocity = this.INITIAL_VELOCITY;
  // }
  // update(delta: number)
  // {
  //   this.x += this.direction.x * this.velocity * delta;
  //   this.y += this.direction.y * this.velocity * delta;
  //   this.velocity += this.VELOCITY_INCREASE;
  //   const rect = this.rect();

  //   if (rect.bottom >= window.innerHeight || rect.top <= 0)
  //   {
  //       this.direction.y *= -1;
  //   }
  // }
  // randomNumberBetween(min: number, max: number)
  // {
  //   return Math.random() * (max - min) + min;
  // }

  // isCollision(rect1, rect2)
  // {
  //   return (rect1.left < rect2.right && rect1.right >= rect2.left && rect1.top <= rect2.bottom && rect1.bottom >= rect2.top) 
  // }
}
