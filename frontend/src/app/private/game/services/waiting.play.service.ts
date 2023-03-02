import { room } from "../components/game.front/game.front.component";

let computerPad: any;
let left_pad: any;
let ball : any;
let ball_velocity_x : number;
let ball_velocity_y : number;
let start : boolean;



export class WaitingScene extends Phaser.Scene 
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
  }

   getRandomInt(min : number, max: number) 
   {
        min = Math.ceil(min);
        max = Math.floor(max);
        let result = (Math.floor(Math.random() * (max - min)) + min);
        return result
    }   

  preload() {
    this.load.image('computerPad', 'assets/images/pad.png');
    this.load.image('left_pad', 'assets/images/pad2.png');
    this.load.image('ball', 'assets/images/ball.png');
  }

  create() 
  {
    this.score = this.add.text(1160 / 2, 10, this.left_score + ' | ' + this.right_score , { font: '48px Arial'});
    this.wall_bottom = this.add.rectangle(1295 / 2, 745, 1310, 10 , 0xff0000);
    this.wall_top = this.add.rectangle(1295 / 2, -5, 1310, 10 , 0xff0000);
    /////////////BALL CONFIG/////////////////////////////
    ball = this.physics.add.image(1050 / 2, 740 / 2, 'ball').setCollideWorldBounds(false);
    ball.scale = 0.05;
    ball.setVelocity(400,400);
    ball.setBounce(1,1);
    /////////////PADS CONFIG/////////////////////////////
    left_pad = this.physics.add.image(30, 350, 'left_pad').setCollideWorldBounds(true);
    computerPad = this.physics.add.image(1310, 350, 'computerPad').setCollideWorldBounds(true);
    left_pad.scale = 0.3;
    computerPad.scale = 0.3;
    left_pad.body.pushable = false;
    computerPad.body.pushable = false;
    //////////////////////////////////////////////////
    this.physics.add.existing(this.wall_bottom, true); // Ajoute la physique au rectangle cree avec phaser
    this.physics.add.existing(this.wall_top, true); // Ajoute la physique au rectangle cree avec phaser
    this.physics.add.existing(ball, true);
    //////////////////////////////////////////////////
    this.physics.add.collider(computerPad, ball);
    this.physics.add.collider(ball, left_pad);
    this.physics.add.collider(ball, this.wall_bottom); // Ajoute la collision entre l'object cree avec phaser et un autre objet
    this.physics.add.collider(ball, this.wall_top);
    //////////////////////////////////////////////////
    this.physics.add.collider(computerPad, this.wall_bottom);
    this.physics.add.collider(computerPad, this.wall_top);
    this.physics.add.existing(computerPad, true);


    this.input.on('pointermove', function (pointer)
    {
        left_pad.setVisible(true).setPosition(30, pointer.y)
    }, this);
  }

  override update() 
  {
    
    computerPad.setY(ball.y)
    if (ball.x > 1310)
    {
      this.scene.restart();
      this.left_score++;
      ball_velocity_x = this.getRandomInt(200, 700);
      ball_velocity_y = this.getRandomInt(200, 500);  
    }
    else if (ball.x < 0)
    {
      this.scene.restart();
      this.right_score++;
      ball_velocity_x = this.getRandomInt(-200, -700);
      ball_velocity_y = this.getRandomInt(-200, -500);
    }
  }
}
