import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { LaunchGameService } from '../../../services/launch.game.service';
import { inHeight, inWidth, room } from '../../game.front/game.front.component';


@Component({
  selector: 'app-stars-blow',
  templateUrl: './stars.blow.component.html',
  styleUrls: ['./stars.blow.component.scss']
})
export class StarsBlowComponent implements OnInit {
  
  constructor(private launch: LaunchGameService) {}

  hide_waiting : number = 0;

  playSound()
  {
    let audio = new Audio()
    audio.src = "../../../../assets/test.wav";
    audio.load();
    audio.play();
    // setTimeout(() => {
    //   room?.
    // }, 3000);
    this.hide_waiting = this.launch.hideWaiting(this.hide_waiting);
    this.launch.showButtonOn(1);
  }

  ngOnInit(): void 
  {
    blackhole('#blackhole');

    function blackhole(element) {
      var h = inHeight,
          w = inWidth,
          cw = w,
          ch = h,
          maxorbit = 255, // distance from center
          centery = inHeight / 2,
          centerx = inWidth / 2 ;
          var startTime = new Date().getTime();
          var currentTime = 0;
    
      var stars = [],
          collapse = false, // if hovered
          expanse = false; // if clicked
    
      const canvas = document.getElementById('canvas') as HTMLCanvasElement; // Get canvas element using document.getElementById()
      const context = canvas.getContext('2d'); // Call getContext() on canvas element directly    
      context.globalCompositeOperation = "multiply";
    
      function setDPI(canvas, dpi) {
        // Set up CSS size if it's not set up already
        if (!canvas.style.width)
          canvas.style.width = inWidth;
        if (!canvas.style.height)
          canvas.style.height = inHeight;
        canvas.width = inWidth;
        canvas.height = inHeight;
        var ctx = canvas.getContext('2d');
        ctx.scale(1, 1);      
      }
    
      function rotate(cx, cy, x, y, angle) {
        var radians = angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
            ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return [nx, ny];
      }
    
      setDPI(canvas, 192);
    
      var star = function(){
    
        // Get a weighted random number, so that the majority of stars will form in the center of the orbit
        var rands = [];
        rands.push(Math.random() * (maxorbit/2) + 1);
        rands.push(Math.random() * (maxorbit/2) + maxorbit);
    
        this.orbital = (rands.reduce(function(p, c) {
          return p + c;
        }, 0) / rands.length);
        // Done getting that random number, it's stored in this.orbital
    
        this.x = centerx; // All of these stars are at the center x position at all times
        this.y = centery + this.orbital; // Set Y position starting at the center y + the position in the orbit
    
        this.yOrigin = centery + this.orbital;  // this is used to track the particles origin
    
        this.speed = (Math.floor(Math.random() * 2.5) + 1.5)*Math.PI/180; // The rate at which this star will orbit
        this.rotation = 0; // current Rotation
        this.startRotation = (Math.floor(Math.random() * 360) + 1)*Math.PI/180; // Starting rotation.  If not random, all stars will be generated in a single line.  
    
        this.id = stars.length;  // This will be used when expansion takes place.
    
        this.collapseBonus = this.orbital - (maxorbit * 0.7); // This "bonus" is used to randomly place some stars outside of the blackhole on hover
        if(this.collapseBonus < 0){ // if the collapse "bonus" is negative
          this.collapseBonus = 0; // set it to 0, this way no stars will go inside the blackhole
        }
    
        stars.push(this);
        this.color = 'rgba(255,255,255,'+ (1 - ((this.orbital) / 255)) +')'; // Color the star white, but make it more transparent the further out it is generated
    
        this.hoverPos = centery + (maxorbit/2) + this.collapseBonus;  // Where the star will go on hover of the blackhole
        this.expansePos = centery + (this.id%100)*-10 + (Math.floor(Math.random() * 20) + 1); // Where the star will go when expansion takes place
    
    
        this.prevR = this.startRotation;
        this.prevX = this.x;
        this.prevY = this.y;
    
        // The reason why I have yOrigin, hoverPos and expansePos is so that I don't have to do math on each animation frame.  Trying to reduce lag.
      }
      star.prototype.draw = function(){
        // the stars are not actually moving on the X axis in my code.  I'm simply rotating the canvas context for each star individually so that they all get rotated with the use of less complex math in each frame.
    
    
    
        if(!expanse){
          this.rotation = this.startRotation + (currentTime * this.speed);
          if(!collapse){ // not hovered
            if(this.y > this.yOrigin){
              this.y-= 2.5;
            }
            if(this.y < this.yOrigin-4){
              this.y+= (this.yOrigin - this.y) / 10;
            }
          } else { // on hover
            this.trail = 1;
            if(this.y > this.hoverPos){
              this.y-= (this.hoverPos - this.y) / -5;
            }
            if(this.y < this.hoverPos-4){
              this.y+= 2.5;
            }
          }
        } else {
          this.rotation = this.startRotation + (currentTime * (this.speed / 2));
          if(this.y > this.expansePos){
            this.y-= Math.floor(this.expansePos - this.y) / -140;
          }
        }
    
        context.save();
        context.fillStyle = this.color;
        context.strokeStyle = this.color;
        context.beginPath();
        var oldPos = rotate(centerx,centery,this.prevX,this.prevY,-this.prevR);
        context.moveTo(oldPos[0],oldPos[1]);
        context.translate(centerx, centery);
        context.rotate(this.rotation);
        context.translate(-centerx, -centery);
        context.lineTo(this.x,this.y);
        context.stroke();
        context.restore();
    
    
        this.prevR = this.rotation;
        this.prevX = this.x;
        this.prevY = this.y;
      }
    
    
      $('.centerHover').on('click',function(){
        collapse = false;
        expanse = true;
    
        $(this).addClass('open');
        $('.fullpage').addClass('open');
        setTimeout(function(){
          $('.header .welcome').removeClass('gone');
        }, 500);
      });
      $('.centerHover').on('mouseover',function(){
        if(expanse == false){
          collapse = true;
        }
      });
      $('.centerHover').on('mouseout',function(){
        if(expanse == false){
          collapse = false;
        }
      });
    
       const requestFrame = (function() {
        return (
          window.requestAnimationFrame ||
          function(callback) {
            window.setTimeout(callback, 1000 / 60);
          }
        );
      })();
          
      function loop(){
        var now = new Date().getTime();
        currentTime = (now - startTime) / 50;
    
        context.fillStyle = 'rgb(17, 7, 32)'; // somewhat clear the context, this way there will be trails behind the stars 
        context.fillRect(0, 0, cw, ch);
    
        for(var i = 0; i < stars.length; i++){  // For each star
          if(stars[i] != stars){
            stars[i].draw(); // Draw it
          }
        }
    
        requestFrame(loop);
      }
      function init(time? : number){
        context.fillStyle = 'rgba(22, 7, 40, 0)';  // Initial clear of the canvas, to avoid an issue where it all gets too dark
        context.fillRect(0, 0, cw, ch);
        for(var i = 0; i < 2500; i++){  // create 2500 stars
          new star();
        }
        loop();
      }
      init();
    }  
  }

}
