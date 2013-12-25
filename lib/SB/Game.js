/*
 * This file is part of SkipBo.
 * Copyright 2013-2014 by Martin Kelm - All rights reserved.
 * Project page @ https://github.com/mkelm/skipbo
 *
 * SkipBo is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * SkipBo is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with SkipBo. If not, see <http://www.gnu.org/licenses/>.
 */

// game class

SB.Game = function() {
  SB.Element.call(this, "game", false);

  this.display = null;
}

SB.Game.prototype = Object.create(SB.Element.prototype);
SB.Game.prototype.constructor = SB.Game;

SB.Game.prototype.initDisplay = function() {
  this.display = new PIXI.DisplayObjectContainer();
  this.display.position.x = 0;
  this.display.position.y = 0;

  this.display.pivot = {x: 0.5, y: 0.5 };
  this.display.position = {x: sb.pixi.screen.width/2, y: sb.pixi.screen.height/2 };

  this.display.scale = {x: sb.pixi.screen.ratio, y: sb.pixi.screen.ratio};
  sb.pixi.stage.addChild(this.display);
}

SB.Game.prototype.start = function() {
  this.initDisplay();

}

/*SBX.Game.prototype.initGameTitle = function() {
  var style = {font: Math.floor(120 * sbx.pixi.screen.ratio) + "px " + "Arial", fill: "FFFFFF"};
  var gameTitle = new PIXI.Text("Starball X", style);
  gameTitle.anchor = { x: 0.5, y: 0.5 };
  gameTitle.position.x = sbx.pixi.screen.width / 2;
  gameTitle.position.y = 100 * sbx.pixi.screen.ratio;
  sbx.pixi.stage.addChild(gameTitle);
}

SBX.Game.prototype.initBricks = function() {
  var c = 0, cols = this.brickCols, rows = this.brickRows;
  var x = ((cols / 2) * (-1 * (this.brickSize.w + this.brickMargin.w))) + 0.5 * this.brickMargin.w;
  var y = ((rows / 2) * (-1 * (this.brickSize.h + this.brickMargin.h))) + 0.5 * this.brickMargin.h;
  for (var i = 1; i <= cols; i++) {
    if (typeof this.bricks[i-1] == "undefined") {
      this.bricks[i-1] = [];
    }
    for (var j = 1; j <= rows; j++) {
      var gfx = new PIXI.Graphics();
      gfx.position.x = x + ((i - 1) * (this.brickSize.w + this.brickMargin.w));
      gfx.position.y = y + ((j - 1) * (this.brickSize.h + this.brickMargin.h));
      gfx.beginFill("0xFFFFFF");
      gfx.drawRect(0, 0, this.brickSize.w, this.brickSize.h);
      this.bricks[i-1][j-1] = gfx;
      this.display.addChild(this.bricks[i-1][j-1]);
      c++;
    }
  }
}

SBX.Game.prototype.initBricksBorder = function() {
  this.bricksBorder = {
    x : ((this.brickCols / 2) * (-1 * (this.brickSize.w + this.brickMargin.w))) - 0.5 * this.brickMargin.w,
    y : ((this.brickRows / 2) * (-1 * (this.brickSize.h + this.brickMargin.h))) - 0.5 * this.brickMargin.h,
    w : (this.brickCols * (this.brickSize.w + this.brickMargin.w)) + this.brickMargin.w,
    h : (this.brickRows * (this.brickSize.h + this.brickMargin.h)) + this.brickMargin.h
  };

  var gfx = new PIXI.Graphics();
  gfx.lineStyle(1, 0x00FFFF);
  gfx.moveTo(this.bricksBorder.x, this.bricksBorder.y);
  gfx.lineTo(this.bricksBorder.x + this.bricksBorder.w, this.bricksBorder.y);
  gfx.lineTo(this.bricksBorder.x + this.bricksBorder.w, this.bricksBorder.y + this.bricksBorder.h);
  gfx.lineTo(this.bricksBorder.x, this.bricksBorder.y + this.bricksBorder.h);
  gfx.lineTo(this.bricksBorder.x, this.bricksBorder.y);
  this.display.addChild(gfx);
}

SBX.Game.prototype.initSpaceBorder = function() {
  this.spaceBorder = {
    x : this.bricksBorder.x - 200,
    y : this.bricksBorder.y - 100,
    w : this.bricksBorder.w + 400,
    h : this.bricksBorder.h + 300
  };

  var gfx = new PIXI.Graphics();
  gfx.lineStyle(3, 0xFF0000);
  gfx.moveTo(this.spaceBorder.x, this.spaceBorder.y);
  gfx.lineTo(this.spaceBorder.x + this.spaceBorder.w, this.spaceBorder.y);
  gfx.lineTo(this.spaceBorder.x + this.spaceBorder.w, this.spaceBorder.y + this.spaceBorder.h);
  gfx.lineTo(this.spaceBorder.x, this.spaceBorder.y + this.spaceBorder.h);
  gfx.lineTo(this.spaceBorder.x, this.spaceBorder.y);
  this.display.addChild(gfx);
}

SBX.Game.prototype.initPaddle = function() {
  // paddle to block ball movement
  var gfx = new PIXI.Graphics();
  gfx.position.x = this.spaceBorder.x + (this.spaceBorder.w / 2);
  gfx.position.y = this.spaceBorder.y + this.spaceBorder.h - 10;
  gfx.beginFill("0xFFFFFF");
  gfx.moveTo(0, 0);
  gfx.lineTo(25, 0);
  gfx.lineTo(50, 10);
  gfx.lineTo(-50, 10);
  gfx.lineTo(-25, 0);
  gfx.lineTo(0, 0);
  this.paddle = gfx;
  this.display.addChild(this.paddle);

  // key commands for paddle movement
  var scope = this;
  $("html").keydown(function(e){
    if (e.which == 37) { // left
      scope.movePaddle("left");
    } else if (e.which == 39) { // right
      scope.movePaddle("right");
    }
  });
}

SBX.Game.prototype.movePaddle = function(move) {
  if (move == "left" && this.paddle.position.x > this.spaceBorder.x) {
    this.paddle.position.x = this.paddle.position.x - 15;
  } else if (move == "right" && this.paddle.position.x < this.spaceBorder.x + this.spaceBorder.w) {
    this.paddle.position.x = this.paddle.position.x + 15;
  }
}

SBX.Game.prototype.initBall = function() {
  var gfx = new PIXI.Graphics();
  gfx.position.x = this.paddle.position.x;
  gfx.position.y = this.paddle.position.y - 10;
  gfx.beginFill("0xFFFFFF");
  gfx.drawCircle(0, 0, 10);
  this.ball = {
    graphic : gfx,
    direction : 8
  };
  this.display.addChild(this.ball.graphic);
}*/