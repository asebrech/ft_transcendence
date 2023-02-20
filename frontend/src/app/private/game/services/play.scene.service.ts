import * as Phaser from 'phaser';

let ball_velocity_x : number;
let ball_velocity_y : number;
let right_pad: any;
let left_pad: any;



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
      left_pad.setVisible(true).setPosition(30, pointer.y);
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
