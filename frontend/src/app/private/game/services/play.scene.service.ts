import { inWidth, inHeight, player_left, skinPad, skinBall, opponentPad } from "../components/game.front/game.front.component";
import * as Phaser from "phaser";
import { room } from "../components/game.front/game.front.component";
import { PlayerService } from "../../user/services/player.service";

let start : boolean;
let right_pad: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
let left_pad: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
let ball : Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
let ball_velocity_x : number;
let ball_velocity_y : number;

export class PlayScene extends Phaser.Scene 
{
  left_score : number;
  right_score : number;
  wall_bottom : any;
  wall_top : any;
  false_ball : Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  score : Phaser.GameObjects.Text;
  padHit : boolean;
  bg: Phaser.GameObjects.TileSprite;
  stars: any;
  galaxy : any;
  last_bg_x : number;
  last_bg_y : number;
  speed : number;
  camera1 : Phaser.Cameras.Scene2D.Camera;
  particle : Phaser.GameObjects.Particles.ParticleEmitterManager;
  emitter : any;
  positions: number[][] = [
    [5345, 327], // 0 
    [6369, 1351],// 1
    [512, 680], // 2
    [2833, 1246], // 3
    [3875, 531], // 4
    [908, 3922], // 5
    [3140, 2974], // 6 
    [6052, 4280] // 7
  ];
  isColorPad : boolean;
  isColorBall : boolean;
  skin : string;
  isOpponentColorPad : boolean;


  constructor() 
  {
    super({ key: 'new' });
    this.left_score = 0;
    this.right_score = 0;
    start = false;
    ball_velocity_x = 300;
    ball_velocity_y = 300;
    ///////////////TODO : REGLER L APPARITION ALEATOIR
    let pos = this.getRandomInt(0, 7);
    this.last_bg_x = this.positions[pos][0];
    this.last_bg_y = this.positions[pos][1];
    this.speed = 300;
    /////////////////////////////////////////////////
    if (opponentPad[0] == '#')
    {
      this.isOpponentColorPad = true;
    }
    else
    {
      this.isOpponentColorPad = false;
    }
    /////////////////////////////////////////////////
    if (skinPad[0] == '#')
    {
      this.isColorPad = true;
    }
    else
    {
      this.isColorPad = false;
    }
    ///////// ////////// /////////
    if (skinBall[0] == '#')
    {
      this.isColorBall = true;
    }
    else
    {
      this.isColorBall = false;
    }
    /////////////////////////
    if (player_left == true)
    {
      this.skin = "default.png"
    }
    else
    {
      this.skin = "defaut.png"
    }
    /////////////////////////////////
  }
  
  
  getRandomInt(min : number, max: number) 
  {
    min = Math.ceil(min);
    max = Math.floor(max);
    let result = (Math.floor(Math.random() * (max - min)) + min);
    return result
  }

  convertColorCode(colorCode: string) {
    // Remove "#" symbol from color code
    const hexCode = colorCode.substring(1);
  
    // Convert hexadecimal digits to decimal format
    const red = parseInt(hexCode.substring(0, 2), 16);
    const green = parseInt(hexCode.substring(2, 4), 16);
    const blue = parseInt(hexCode.substring(4, 6), 16);
  
    // Concatenate decimal values and add "0x" prefix
    const hexValue = (red << 16) | (green << 8) | blue;
    // const hexString = "0x" + hexValue.toString(16).padStart(6, "0");
  
    return hexValue;
  }
  
  async preload() 
  {
    if (this.isColorPad == false)
    {
      if(player_left == true)
      {
        this.skin = skinPad.split('/').pop();
        this.load.image('left_pad', 'assets/images/paddle/' + this.skin);
      }
      else
      {
        this.skin = skinPad.split('/').pop();
        this.load.image('right_pad', 'assets/images/paddle/' + this.skin);  
      }
    }
    if (this.isOpponentColorPad == false)
    {
      if (player_left == true)
      {
        this.load.image('right_pad', 'assets/images/paddle/' + opponentPad.split('/').pop());  
      }
      else
      {
        this.load.image('left_pad', 'assets/images/paddle/' + opponentPad.split('/').pop());
      }
    }
    if (this.isColorPad == true)
    {
      this.load.image('right_pad', 'assets/images/paddle/default.png');  
      this.load.image('left_pad', 'assets/images/paddle/default.png');
    }
/////////////////////////////////////////////////////////////////
    if (this.isColorBall == false)
    {
      if(player_left == true)
      {
        this.load.image('ball', 'assets/images/ball/' + skinBall.split('/').pop());
      }
      else
      {
        this.load.image('ball', 'assets/images/ball/' + skinBall.split('/').pop());  
      }
    }
    if (this.isColorBall == true)
    {
      this.load.image('ball', 'assets/images/ball/default.png');
    }

    
    this.load.atlas('space', 'assets/images/tests/space.png', 'assets/images/tests/space.json');
    this.load.image('background', 'assets/images/tests/nebula.jpg');
    this.load.image('stars', 'assets/images/tests/stars.png');
    this.load.image('wing', 'assets/images/tests/wing.png');
    this.load.image('fullscreen', 'assets/images/fullscreenOff.png');
    this.load.image('fullscreenOff', 'assets/images/fullscreen.png');
    this.load.image('readyButton', 'assets/images/readyButton.png');
    this.load.image('blue', 'assets/images/blue.png');
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
    this.stars = this.add.tileSprite(0, 0, 8000, 6000, 'stars').setScrollFactor(0);
    this.camera1 = this.cameras.add(0,0, inWidth, inHeight);
    this.camera1.startFollow(this.bg);
    this.camera1.centerOn(inWidth,inHeight);
    //////////////////////////////////////////////////    
    this.score = this.add.text(inWidth / 2 - 30, 10, this.left_score + ' | ' + this.right_score , { font: '48px Arial'}).setScrollFactor(0);
    this.wall_bottom = this.add.rectangle(inWidth / 2, -5, inWidth, 10 , 0xff0000).setScrollFactor(0);
    this.wall_top = this.add.rectangle(inWidth / 2, inHeight + 5, inWidth, 10 , 0xff0000).setScrollFactor(0);
    right_pad = this.physics.add.image(inWidth - 30, inHeight / 2, 'right_pad').setCollideWorldBounds(true).setScrollFactor(0);
    left_pad = this.physics.add.image(30, inHeight / 2, 'left_pad').setCollideWorldBounds(true).setScrollFactor(0);

    if (this.isColorPad == true)
    {
      if(player_left == true)
        left_pad.setTint(this.convertColorCode(skinPad));
      else
        right_pad.setTint(this.convertColorCode(skinPad));
    }

    if (this.isOpponentColorPad == true)
    {
      if(player_left == true)
        right_pad.setTint(this.convertColorCode(opponentPad));
      else
        left_pad.setTint(this.convertColorCode(opponentPad));
    }

    ball = this.physics.add.image(inWidth / 2, inHeight / 2, 'ball').setCollideWorldBounds(false).setScrollFactor(0);
    
    if (this.isColorBall == true)
    {
      if(player_left == true)
        ball.setTint(this.convertColorCode(skinBall));
      else
        ball.setTint(this.convertColorCode(skinBall));
    }

    //////////////////////////////////////////////////
    ball.scale = 0.1;
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
    //////////////////////////////////////////////////
    this.physics.add.collider(ball, this.wall_bottom); // Ajoute la collision entre l'object cree avec phaser et un autre objet
    this.physics.add.collider(ball, this.wall_top);

    this.physics.add.collider(left_pad, ball, () =>
    {
      if (this.speed < 500)
      {
        this.speed += 100;
        ball.body.velocity.normalize().scale(this.speed);
      }
    });

    this.physics.add.collider(right_pad, ball, () =>
    {
      if (this.speed < 500)
      {
        this.speed += 100;
        ball.body.velocity.normalize().scale(this.speed);
      }    
    });


    this.particle = this.add.particles('space').setInteractive();
    this.emitter = this.particle.createEmitter({
      frame: 'blue',
      speed: ball.body.speed,
      lifespan: 400,
      alpha: 300,
      scale: { start: 1.0, end: 0 },
      blendMode: 'ADD'
    });


    ////////////////////////////////////////////
    var buttonOn = this.add.image(inWidth - 30 , 30, 'fullscreen', 0).setInteractive().setScrollFactor(0);
    var buttonOff = this.add.image(inWidth - 30 , 30, 'fullscreenOff', 0).setInteractive().setScrollFactor(0);
    var readyButton = this.add.image(inWidth / 2 , inHeight / 2, 'readyButton', 0).setInteractive().setScrollFactor(0);
    buttonOff.setVisible(false);
    buttonOff.scale = 0.3;
    buttonOn.scale = 0.3;
    readyButton.scale = 0.5;
    buttonOn.on('pointerup', function () 
    {
      this.scale.startFullscreen();
      buttonOn.setVisible(false);
      buttonOff.setVisible(true);
    }, this);
    buttonOff.on('pointerup', function () 
    {
      this.scale.stopFullscreen();
      buttonOn.setVisible(true);
      buttonOff.setVisible(false);
    }, this);
    readyButton.on('pointerup', function () 
    {
      room?.send("ready");
      readyButton.setVisible(false);
    }, this);
    //////////////////////////////////////////
    this.input.on('pointermove', function (pointer)
    {
      if(player_left == true)
      {
        left_pad.setVisible(true).setPosition(30, pointer.y);
        room?.send("move_left_pad", {x : left_pad.x, y : left_pad.y});
      }
      else if (player_left == false)
      {
        right_pad.setVisible(true).setPosition(inWidth - 30, pointer.y);
        room?.send("move_right_pad", {x : right_pad.x, y :right_pad.y});
      }
      room?.onMessage("paddle_left", ({x, y})=>
      {
        if(player_left == false)
        {
          left_pad.setVisible(true).setPosition(x, y);
        }
      })
      room?.onMessage("paddle_right", ({x, y}) =>
      {
        if(player_left == true)
        {
          right_pad.setVisible(true).setPosition(x, y);
        }
      })
    }, this);
    room?.onMessage("launch", ({x, y}) =>{
        ball.setVelocity(x, y);
        start = true;
    });
  }
  
  override update()
  {
    if (start == true)
      room?.send("ball_position", ({x : ball.x, y : ball.y}))

    room?.onMessage("set_ball_position", ({x, y})=>
    {
      if(player_left == false)
      {
        let newX = Phaser.Math.Interpolation.Linear([ball.x, x], 1);
        let newY = Phaser.Math.Interpolation.Linear([ball.y, y], 1);
        ball.setPosition(newX, newY);
      }
    })
    if (ball.x > inWidth || ball.x < 0)
    {
      if (player_left == true)
      {
        if (ball.x > inWidth)
        {
          this.left_score += 1;
          this.score.setText(this.left_score + ' | ' + this.right_score)
        }
        else
        {
          this.right_score += 1;
          this.score.setText(this.left_score + ' | ' + this.right_score)
        }
        ball.setPosition(inWidth / 2, inHeight / 2);
        room?.send("score_update", ({score_left : this.left_score, score_right : this.right_score}));
      };
    }
    room?.onMessage("updated_score", (message) =>
    {
      if (player_left == false)
      {
        this.left_score = message.s_l;
        this.right_score = message.s_r;
        this.score.setText(this.left_score + ' | ' + this.right_score)
      }
    });

    if ((this.right_score || this.left_score) > 2)
    {
      this.emitter.startFollow(ball).setScrollFactor(0);
    }
    if (player_left == true)
    {
      if ((this.right_score || this.left_score) > 4)
      {
        if (this.left_score > this.right_score)
        {
          room?.send("game_finished", ({score_left : this.left_score, score_right : this.right_score, winner : true}));
        }
        else
        {
          room?.send("game_finished", ({score_left : this.left_score, score_right : this.right_score, winner : false}));
        }
      }
    }
    ///////////////////////////////////////////////////////////////
    // this.bg.x += 1;
    // this.bg.y += 1;
    // this.last_bg_x++;
    // this.last_bg_y++;
    // this.stars.tilePositionX += 1;
    // this.stars.tilePositionY += 1;
    /////////////////////////////////////////////////////////////
  }
}
