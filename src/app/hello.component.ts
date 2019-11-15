import { Component, OnInit, Injectable } from '@angular/core';
import { NewScene } from './scenes/new-scene';
import Phaser from 'phaser';

@Component({
  selector: 'hello',
  template: `<div id="gameContainer"></div>`,
  styles: [`h1 { font-family: Lato; }`]
})
export class HelloComponent implements OnInit {  

  game: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor(public newScene: NewScene) {}

  ngOnInit() {
    this.config = {      
      title: 'Game Title',
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
