import { Component, OnInit, Injectable } from '@angular/core';
import Phaser from 'phaser';

@Injectable({
  providedIn: 'root'
})
export class NewScene extends Phaser.Scene {  

  private platforms: Phaser.Physics.Arcade.StaticGroup = null;
  private player: Phaser.Physics.Arcade.Sprite = null;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys = null;
  public score = 0;
  public scoreText;
  public gameOver = false;
  bombs: Phaser.Physics.Arcade.Group;
  stars: Phaser.Physics.Arcade.Group; 

  constructor() {
    super({ key: 'new' });    
  }

public preload() {    
    const baseAssets = "https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/src/games/firstgame/assets/";
    this.load.image('sky', baseAssets + 'sky.png');
    this.load.image('ground', baseAssets + 'platform.png');
    this.load.image('star', baseAssets + 'star.png');
    this.load.image('bomb', baseAssets + 'bomb.png');
    this.load.spritesheet('dude', baseAssets + 'dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
  }

  public create(): void {
    this.add.image(400, 300, 'sky');

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(300);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    this.physics.add.collider(this.player, this.platforms);

    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });
    this.stars.children.iterate((child: any) => {
        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.8));
    });
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    this.bombs = this.physics.add.group();

    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

  }

  public update(): void {     
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-530);
    }
  }

  public collectStar(player, star) {
    star.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate((child: any) => {
          child.enableBody(true, child.x, 0, true, true);
      });
      const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
      const bomb = this.bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }

  }

  hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    this.gameOver = true;
  }

}
