import { inWidth, inHeight } from "../components/game.front/game.front.component";
import * as Phaser from "phaser";
import { room } from "../components/game.front/game.front.component";
import { flatMap } from "rxjs";

let start : boolean;
let right_pad: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
let left_pad: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
let ball : any;
let ball_velocity_x : number;
let ball_velocity_y : number;



export class PlayScene extends Phaser.Scene 
{
  left_score : number;
  right_score : number;
  wall_bottom : any;
  wall_top : any;
  false_ball : any;
  score : Phaser.GameObjects.Text;
  padHit : boolean;
  bg: Phaser.GameObjects.TileSprite;
  stars: any;
  galaxy : any;
  last_bg_x : number;
  last_bg_y : number;
  speed : number;
  camera1 : Phaser.Cameras.Scene2D.Camera;




  constructor() 
  {
    super({ key: 'new' });
    this.left_score = 0;
    this.right_score = 0;
    start = false;
    ball_velocity_x = 300;
    ball_velocity_y = 300;
    ///////////////TODO : REGLER L APPARITION ALEATOIR
    this.last_bg_x = 5345 + 1024;
    this.last_bg_y = 327 + 1024;
    this.speed = 300;
  }

  
   getRandomInt(min : number, max: number) 
   {
    min = Math.ceil(min);
    max = Math.floor(max);
    let result = (Math.floor(Math.random() * (max - min)) + min);
    return result
    }

  async preload() 
  {
    this.load.image('right_pad', 'assets/images/pad.png');
    this.load.image('left_pad', 'assets/images/pad2.png');
    this.load.atlas('space', 'assets/images/tests/space.png', 'assets/images/tests/space.json');
    this.load.image('background', 'assets/images/tests/nebula.jpg');
    this.load.image('stars', 'assets/images/tests/stars.png');
    this.load.image('wing', 'assets/images/tests/wing.png');
    this.load.image('ball', 'assets/images/ball.png');
    this.load.image('fullscreen', 'assets/images/fullscreenOff.png')
    this.load.image('fullscreenOff', 'assets/images/fullscreen.png')

  }

  async create() 
  {
    //  World size is 8000 x 6000
    this.bg = this.add.tileSprite(this.last_bg_x, this.last_bg_y, inWidth, inHeight, 'background');
    //  Add our planets, etc
    this.add.image(512, 680, 'space', 'blue-planet').setOrigin(0).setScrollFactor(0.6);
    this.add.image(2833, 1246, 'space', 'brown-planet').setOrigin(0).setScrollFactor(0.6);
    this.add.image(3875, 531, 'space', 'sun').setOrigin(0).setScrollFactor(0.6);
    this.galaxy = this.add.image(5345 + 1024, 327 + 1024, 'space', 'galaxy').setBlendMode(1).setScrollFactor(0.6);
    this.add.image(908, 3922, 'space', 'gas-giant').setOrigin(0).setScrollFactor(0.6);
    this.add.image(3140, 2974, 'space', 'brown-planet').setOrigin(0).setScrollFactor(0.6).setScale(0.8).setTint(0x882d2d);
    this.add.image(6052, 4280, 'space', 'purple-planet').setOrigin(0).setScrollFactor(0.6);
    for (let i = 0; i < 8; i++)
      {
          this.add.image(Phaser.Math.Between(0, 8000), Phaser.Math.Between(0, 6000), 'space', 'eyes').setBlendMode(1).setScrollFactor(0.8);
      }
      this.tweens.add({
        targets: this.galaxy,
        angle: 360,
        duration: 100000,
        ease: 'Linear',
        loop: -1
    });
    this.stars = this.add.tileSprite(0, 0, inWidth, inHeight, 'stars').setScrollFactor(0);
    this.camera1 = this.cameras.add(0,0, inWidth, inHeight);
    this.camera1.startFollow(this.bg)
    this.camera1.centerOn(inWidth,inHeight);
    //////////////////////////////////////////////////    
    this.score = this.add.text(inWidth / 2, 10, this.left_score + ' | ' + this.right_score , { font: '48px Arial'}).setScrollFactor(0);
    this.wall_bottom = this.add.rectangle(inWidth / 2, -5, inWidth, 10 , 0xff0000).setScrollFactor(0);
    this.wall_top = this.add.rectangle(inWidth / 2, inHeight + 5, inWidth, 10 , 0xff0000).setScrollFactor(0);
    right_pad = this.physics.add.image(inWidth - 30, 350, 'right_pad').setCollideWorldBounds(true).setScrollFactor(0);
    left_pad = this.physics.add.image(30, 350, 'left_pad').setCollideWorldBounds(true).setScrollFactor(0);
    ball = this.physics.add.image(inWidth / 2, inHeight / 2, 'ball').setCollideWorldBounds(false).setScrollFactor(0);
    this.false_ball = this.physics.add.image(inWidth / 2, inHeight / 2, 'ball').setCollideWorldBounds(false).setVisible(false);
    //////////////////////////////////////////////////
    this.false_ball.body.setBounce(1,1);
    this.false_ball.scale = 0.03;
    ball.scale = 0.03;
    ball.setVelocity(ball_velocity_x,ball_velocity_y);
    ball.setBounce(1,1);
    right_pad.scale = 0.3;
    right_pad.setBounce(1,1);
    right_pad.setPushable(false);
    left_pad.scale = 0.3;
    left_pad.setBounce(1,1);
    left_pad.setPushable(false);
    //////////////////////////////////////////////////
    this.physics.add.existing(this.wall_top, true); // Ajoute la physique au rectangle cree avec phaser
    this.physics.add.existing(this.wall_bottom, true); // Ajoute la physique au rectangle cree avec phaser
    this.physics.add.existing(ball, true);
    this.physics.add.existing(left_pad, true);
    this.physics.add.existing(right_pad, true);
    this.physics.add.existing(this.false_ball, true);
    //////////////////////////////////////////////////
    this.physics.add.collider(ball, this.wall_bottom); // Ajoute la collision entre l'object cree avec phaser et un autre objet
    this.physics.add.collider(ball, this.wall_top);
    this.physics.add.collider(this.false_ball, this.wall_top);
    this.physics.add.collider(this.false_ball, this.wall_bottom); // Ajoute la collision entre l'object cree avec phaser et un autre objet
    this.physics.add.collider(left_pad, this.false_ball, () =>
    {
      this.speed += 100;
      ball.body.velocity.normalize().scale(this.speed);
    });
    this.physics.add.collider(right_pad, this.false_ball, () =>
    {
      this.speed += 100;
      ball.body.velocity.normalize().scale(this.speed);
    });
    ////////////////////////////////////////////
    var buttonOn = this.add.image(inWidth - 30 , 30, 'fullscreen', 0).setInteractive().setScrollFactor(0);
    var buttonOff = this.add.image(inWidth - 30 , 30, 'fullscreenOff', 0).setInteractive().setScrollFactor(0);
    buttonOff.setVisible(false);
    buttonOn.scale = 0.3;
    buttonOn.on('pointerup', function () 
    {
      this.scale.startFullscreen();
      buttonOn.setVisible(false);
      buttonOff.setVisible(true);
    }, this);
    buttonOff.scale = 0.3;
    buttonOff.on('pointerup', function () 
    {
      this.scale.stopFullscreen();
      buttonOn.setVisible(true);
      buttonOff.setVisible(false);
    }, this);
    //////////////////////////////////////////
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
    
    room?.onMessage("position", ({x, y}) =>
    {
      ball.setPosition(x,y);
    })
    ///////////////////////////////////////////////////////////////
    if (this.right_score || this.left_score == 10)
    {

    }
    ///////////////////////////////////////////////////////////////
    if (ball.x > inWidth)
    {
      ball_velocity_x = this.getRandomInt(200, 300);
      ball_velocity_y = this.getRandomInt(200, 300);
    }
    else if (ball.x < 0)
    {
      ball_velocity_x = this.getRandomInt(-200, -300);
      ball_velocity_y = this.getRandomInt(-200, -300);
    }
    ///////////////////////////////////////////////////////////////
    this.bg.x += 1;
    this.bg.y += 1;
    this.last_bg_x++;
    this.last_bg_y++;
    this.stars.tilePositionX += 1;
    this.stars.tilePositionY += 1;
    /////////////////////////////////////////////////////////////
  

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
