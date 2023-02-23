import { GameFrontComponent, client } from "../components/game.front/game.front.component";
import { Client, Room } from 'colyseus.js';
import * as Colyseus from "colyseus.js";
import { room } from "../components/game.front/game.front.component";

let right_pad: any;
let left_pad: any;
let ball : any;
let start : boolean;



export class PlayScene extends Phaser.Scene 
{
  score : any;
  left_score : number;
  right_score : number;
  wall_bottom : any;
  wall_top : any;

  false_ball : any;


  constructor() 
  {
    super({ key: 'new' });
    this.left_score = 0;
    this.right_score = 0;
    start = false;
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

  async create() 
  {
    this.score = this.add.text(970 / 2, 10, this.left_score + ' | ' + this.right_score , { font: '48px Arial'});

    this.wall_bottom = this.add.rectangle(1050 / 2, 745, 950, 10 , 0xff0000);
    this.wall_top = this.add.rectangle(1050 / 2, -5, 950, 10 , 0xff0000);
    
    
    // Ball config
    ball = this.add.circle(1050 / 2,740 / 2 , 20, 0XFFFFFF)
  
    
    this.false_ball = this.physics.add.image(1050 / 2, 740 / 2, 'ball').setCollideWorldBounds(false).setVisible(false);
    this.false_ball.body.setBounce(1,1);
    this.false_ball.scale = 0.03;

    // Pads config
    left_pad = this.physics.add.image(30, 350, 'left_pad').setCollideWorldBounds(true);
    right_pad = this.physics.add.image(1020, 350, 'right_pad').setCollideWorldBounds(true);
    left_pad.scale = 0.3;
    right_pad.scale = 0.3;
    left_pad.body.pushable = false;
    right_pad.body.pushable = false;
    //
    this.physics.add.collider(right_pad, this.false_ball);
    this.physics.add.collider(this.false_ball, left_pad);
    this.physics.add.collider(this.false_ball, this.wall_top);
    this.physics.add.collider(this.false_ball, this.wall_bottom); // Ajoute la collision entre l'object cree avec phaser et un autre objet
    
    this.physics.add.existing(this.wall_bottom, true); // Ajoute la physique au rectangle cree avec phaser
    this.physics.add.existing(this.wall_top, true); // Ajoute la physique au rectangle cree avec phaser
    this.physics.add.existing(ball, true);
    this.physics.add.existing(this.false_ball, true);

    this.physics.add.collider(right_pad, ball);
    this.physics.add.collider(ball, left_pad);
    this.physics.add.collider(ball, this.wall_bottom); // Ajoute la collision entre l'object cree avec phaser et un autre objet
    this.physics.add.collider(ball, this.wall_top);


    this.input.on('pointermove', function (pointer)
    {
      room?.send("move", {y : pointer.y}) // envois pos pointeur souris en y 
      room?.onMessage("paddle_left", (message) =>{ // reception pos pointeur souris en y
        left_pad.setVisible(true).setPosition(30, message.y);
      })
      room?.onMessage("paddle_right", (message) =>{
        right_pad.setVisible(true).setPosition(920, message.y);
      })
    }, this);
 
     room?.onMessage("launch", ({x, y}) =>{
        this.false_ball.setVelocity(x, y);
        start = true;
      })
  }

  

  override update() 
  {
    
    if(start == true)
      room?.send("ball_pos", {x : this.false_ball.x, y : this.false_ball.y})
    
      room?.onMessage("position", ({x, y}) =>{
      ball.setPosition(x,y);
    })

    // room?.send("ball_launch", {ball_velocity_x, ball_velocity_y})
    // if (ball.x > 950)
    // {
    //   this.scene.restart();
    //   this.left_score++;
    //   ball_velocity_x = this.getRandomInt(200, 700);
    //   ball_velocity_y = this.getRandomInt(200, 500);  
    // }
    // else if (ball.x < 0)
    // {
    //   this.scene.restart();
    //   this.right_score++;
    //   ball_velocity_x = this.getRandomInt(-200, -700);
    //   ball_velocity_y = this.getRandomInt(-200, -500);
    // }
  }
}
