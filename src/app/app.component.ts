import { Component, OnInit, Injectable } from '@angular/core';
import { NewScene } from './scenes/new-scene';
import Phaser from 'phaser';


@Component({
  selector: 'my-app',
  template: '<div id="gameContainer"></div>'
})
export class AppComponent  {
  game: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor(public newScene: NewScene) {}

  ngOnInit() {
    this.config = {      
      title: 'Game Title',
      parent: 'gameContainer',
      version: '1.0',
      type: Phaser.AUTO,
      width: 800, // window.innerWidth,
      height: 600, // window.innerHeight,
      scene: [this.newScene],
      physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
      }
    }
    this.game = new Phaser.Game(this.config);   
       
  }
}
