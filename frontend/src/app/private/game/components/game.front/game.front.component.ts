import { Component, OnInit} from '@angular/core';
import * as Phaser from 'phaser';

class NewScene extends Phaser.Scene 
{
  score : any;
  left_score : number;
  right_score : number;

  right_pad: any;
  left_pad: any;

  wall_bottom : any;
  wall_top : any;

  ball : any;
  ball_velocity : number;

  greenKeys: any;
  blueKeys: any;


  constructor() 
  {
    super({ key: 'new' });
    this.left_score = 0;
    this.right_score = 0;
    this.ball_velocity = 0;
  }

   getRandomInt(min : number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  increase_velocity()
  {
    this.ball_velocity + 100;
  }

  preload() {
    this.load.setBaseURL('');
    this.load.image('right_pad', 'assets/images/pad.png');
    this.load.image('left_pad', 'assets/images/pad2.png');
    this.load.image('ball', 'assets/images/ball.png');
  }

  create() {
    this.ball_velocity = this.getRandomInt(-200, 200);
    this.score = this.add.text(850 / 2, 10, this.left_score + ' | ' + this.right_score , { font: '48px Arial'});

    this.wall_bottom = this.add.rectangle(950 / 2, 699, 950, 10 , 0xff0000);
    this.wall_top = this.add.rectangle(950 / 2, -5, 950, 10 , 0xff0000);
    
    this.greenKeys = this.input.keyboard.createCursorKeys();
    this.blueKeys = this.input.keyboard.addKeys('s,w');
    
    // Ball config
    this.ball = this.physics.add.image(950 / 2, 694 / 2, 'ball').setCollideWorldBounds(false);
    this.ball.setVelocityX(-200, 15);
    this.ball.scale = 0.03;
    this.ball.body.setBounce(1,1);
    //

    // Pads config
    this.left_pad = this.physics.add.image(30, 350, 'left_pad').setCollideWorldBounds(true);
    this.right_pad = this.physics.add.image(920, 350, 'right_pad').setCollideWorldBounds(true);
    this.left_pad.scale = 0.3;
    this.right_pad.scale = 0.3;
    this.left_pad.body.pushable = false;
    this.right_pad.body.pushable = false;
    //
    
    this.physics.add.existing(this.wall_bottom, true); // Ajoute la physique au rectangle cree avec phaser
    this.physics.add.existing(this.wall_top, true); // Ajoute la physique au rectangle cree avec phaser
    this.physics.add.existing(this.ball, true);
    this.physics.add.collider(this.right_pad, this.ball);
    this.physics.add.collider(this.ball, this.left_pad);
    this.physics.add.collider(this.ball, this.wall_bottom); // Ajoute la collision entre l'object cree avec phaser et un autre objet
    this.physics.add.collider(this.ball, this.wall_top);
    
    this.input.on('pointermove', function (pointer)
    {
      this.left_pad.setVisible(true).setPosition(30, pointer.y);
    }, this);

  }
  
  override update() 
  {
    if (this.ball.x > 950)
    {
      this.scene.restart();
      this.left_score++;
    }
    else if (this.ball.x < 0)
    {
      this.scene.restart();
      this.right_score++;
    }
    if (this.greenKeys.up.isDown) {
      this.right_pad.setVelocityY(-200);
    } else if (this.greenKeys.down.isDown) {
      this.right_pad.setVelocityY(200);
    } else if (!this.right_pad.triggered) {
      this.right_pad.setVelocity(0);
    }
  }
}

@Component({
  selector: 'app-game.front',
  templateUrl: './game.front.component.html',
  styleUrls: ['./game.front.component.scss'],
})

export class GameFrontComponent implements OnInit {
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {

    this.config = {
      type: Phaser.AUTO,
      scene: [NewScene],
      scale: {
        mode: Phaser.Scale.FIT,
        parent: 'gameContainer',
        height: 694,
        width: 950,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 }
        }
      }
    };
  }

  ngOnInit() 
  {
    this.phaserGame = new Phaser.Game(this.config);
  }

}