import { Component, NgModule, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import * as Phaser from 'phaser';
import * as Colyseus from "colyseus.js";
import { Client } from 'colyseus.js';
import { NgModel } from '@angular/forms';
import { recommendCommands } from 'yargs';
import { StarsService } from 'src/app/services/stars-service/stars.service';

let ball_velocity_x : number;
let ball_velocity_y : number;
let right_pad: any;
let left_pad: any;
let room : any;


@Component({
  selector: 'app-game.front',
  templateUrl: './game.front.component.html',
  styleUrls: ['./game.front.component.scss'],
})


export class GameFrontComponent implements OnInit, OnDestroy
{
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;
  client : Client;

  constructor(private starsService: StarsService) 
  {}

  ngOnInit()
  {

	//background
	this.starsService.setActive(false);

    this.client = new Colyseus.Client("ws://localhost:3000");
    // room = this.client.joinOrCreate("my_room", {/* options */});

    this.config = {
      type: Phaser.AUTO,
      scene: [PlayScene],
      scale: {
        mode: Phaser.Scale.FIT,
        parent: 'gameContainer',
        height: 694,
        width: 950,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {y : 0, x: 0 }
        }
      }
    };
    this.phaserGame = new Phaser.Game(this.config);
  }
  
  async test()
  {
    try {
      room = await this.client.joinOrCreate("my_room", { });
      console.log(room);
      console.log(this.client.auth);
    } catch (e) {
      console.error("join error", e);
    }  
  }
  ngOnDestroy(): void {
	this.starsService.setActive(true);
  }
}

export class PlayScene extends Phaser.Scene 
{
  score : any;
  left_score : number;
  right_score : number;

  wall_bottom : any;
  wall_top : any;

  ball : any;

  constructor() 
  {
    super({ key: 'new' });
    this.left_score = 0;
    this.right_score = 0;
    ball_velocity_x = 400;
    ball_velocity_y = 400;
  }
  
   getRandomInt(min : number, max: number) 
   {
    min = Math.ceil(min);
    max = Math.floor(max);
    let result = (Math.floor(Math.random() * (max - min)) + min);
    return result
    }

  preload() {
    this.load.setBaseURL('');
    this.load.image('right_pad', 'assets/images/pad.png');
    this.load.image('left_pad', 'assets/images/pad2.png');
    this.load.image('ball', 'assets/images/ball.png');
  }

  create() 
  {
    // console.log(ball_velocity_x);
    // console.log(ball_velocity_y);
    this.score = this.add.text(850 / 2, 10, this.left_score + ' | ' + this.right_score , { font: '48px Arial'});

    this.wall_bottom = this.add.rectangle(950 / 2, 699, 950, 10 , 0xff0000);
    this.wall_top = this.add.rectangle(950 / 2, -5, 950, 10 , 0xff0000);
    
    
    // Ball config
    this.ball = this.physics.add.image(950 / 2, 694 / 2, 'ball').setCollideWorldBounds(false);
    this.ball.scale = 0.03;
    this.ball.body.setBounce(1,1);
    // this.ball.setVelocity(ball_velocity_x, ball_velocity_y);
    //

    // Pads config
    left_pad = this.physics.add.image(30, 350, 'left_pad').setCollideWorldBounds(true);
    right_pad = this.physics.add.image(920, 350, 'right_pad').setCollideWorldBounds(true);
    left_pad.scale = 0.3;
    right_pad.scale = 0.3;
    left_pad.body.pushable = false;
    right_pad.body.pushable = false;
    //
    
    this.physics.add.existing(this.wall_bottom, true); // Ajoute la physique au rectangle cree avec phaser
    this.physics.add.existing(this.wall_top, true); // Ajoute la physique au rectangle cree avec phaser
    this.physics.add.existing(this.ball, true);

    this.physics.add.collider(right_pad, this.ball);
    this.physics.add.collider(this.ball, left_pad);
    this.physics.add.collider(this.ball, this.wall_bottom); // Ajoute la collision entre l'object cree avec phaser et un autre objet
    this.physics.add.collider(this.ball, this.wall_top);
    
    this.input.on('pointermove', function (pointer)
    {
      room?.send("move", {y : pointer.y})
      room?.onMessage("paddle_left", (message) =>{
        left_pad.setVisible(true).setPosition(30, message.y);
      })
      room?.onMessage("paddle_right", (message) =>{
        right_pad.setVisible(true).setPosition(920, message.y);
      })

    }, this);
  }
  
  override update() 
  {
    if (this.ball.x > 950)
    {
      this.scene.restart();
      this.left_score++;
      ball_velocity_x = this.getRandomInt(200, 700);
      ball_velocity_y = this.getRandomInt(200, 500);  
    }
    else if (this.ball.x < 0)
    {
      this.scene.restart();
      this.right_score++;
      ball_velocity_x = this.getRandomInt(-200, -700);
      ball_velocity_y = this.getRandomInt(-200, -500);
    }
  }
}
