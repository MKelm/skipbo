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

  this.cards = [];
  this.cardsMulti = 6;
  this.cardsMax = 12;
  this.cardsStack = {
    start : [],
    pos0 : [],
    pos1 : [],
    pos2 : [],
    pos3 : []
  };

  this.players = [
    new SB.Player(),
    new SB.Player(true),
    new SB.Player(true),
    new SB.Player(true)
  ];
  this.currentPlayer = 0;
}

SB.Game.prototype = Object.create(SB.Element.prototype);
SB.Game.prototype.constructor = SB.Game;

SB.Game.prototype.initDisplay = function() {
  this.display = new PIXI.DisplayObjectContainer();
  this.display.pivot = {x: 0.5, y: 0.5 };
  this.display.position = {x: sb.pixi.screen.width/2, y: sb.pixi.screen.height/2 };

  this.display.scale = {x: sb.pixi.screen.ratio, y: sb.pixi.screen.ratio};
  sb.pixi.stage.addChild(this.display);
}

SB.Game.prototype.initCards = function() {
  var c = 0;
  for (var i = 1; i <= this.cardsMax; i++) {
    for (var j = 1; j <= this.cardsMulti; j++) {
      this.cards[c] = { value : i, gfx : this.getCardGfx(i, true) };
      c++;
    }
  }
}

SB.Game.prototype.mixCards = function(rounds) {
  var newPosition = 0, card = {};
  for (var r = 0; r < rounds; r++) {
    for (var position = 0; position < this.cards.length; position++) {
      newPosition = Math.floor(Math.random() * (this.cards.length - 1));
      card = this.cards[newPosition];
      this.cards[newPosition] = this.cards[position];
      this.cards[position] = card;
    }
  }
}

SB.Game.prototype.getCardColor = function(value, open) {
  var color = null;
  if (open === true) {
    if (value < 5) {
      color = "008B9F";
    } else if (value < 9) {
      color = "0F9F00";
    } else if (value < 13) {
      color = "CD0092";
    }
  } else {
    color = "000B7C";
  }
  return color;
}

SB.Game.prototype.getCardGfx = function(value, open) {
  var cardGfx = new PIXI.DisplayObjectContainer();
  cardGfx.pivot = {x: 0.5, y: 0.5 };
  cardGfx.position = {x: 0, y: 0 };
  cardGfx.scale = {x: sb.pixi.screen.ratio, y: sb.pixi.screen.ratio};
  cardGfx.visible = false;

  var width = 120, height = 200;
  var gfx = new PIXI.Graphics();
  var color = this.getCardColor(value, open);
  gfx.lineStyle(5, "0x"+color);
  gfx.beginFill("0xE6E6E6");
  gfx.moveTo(-1 * width / 2, -1 * height / 2);
  gfx.lineTo(1 * width / 2, -1 * height / 2);
  gfx.lineTo(1 * width / 2, 1 * height / 2);
  gfx.lineTo(-1 * width / 2, 1 * height / 2);
  gfx.lineTo(-1 * width / 2, -1 * height / 2);
  if (open === true) {
    var style = {font: 48 + "px " + "Arial", fill: color};
    var valueText = new PIXI.Text(value, style);
    valueText.anchor = { x: 0.5, y: 0.5 };
    valueText.position = { x: 0, y: 0 };
  } else {
    gfx.moveTo(-1 * width / 2, 1 * height / 2);
    gfx.lineTo(1 * width / 2, -1 * height / 2);
  }
  cardGfx.addChild(gfx);
  if (open === true) {
    cardGfx.addChild(valueText);
  }
  this.display.addChild(cardGfx);
  return cardGfx;
}

SB.Game.prototype.showCard = function(cardId, x, y) {
  this.cards[cardId].gfx.position = { x: x, y: y };
  this.cards[cardId].gfx.visible = true;
}

SB.Game.prototype.hideCard = function(cardId) {
  this.cards[cardId].gfx.visible = false;
}

SB.Game.prototype.start = function() {
  this.initDisplay();

  this.initCards();
  this.mixCards(3);

  // put cards to start stock
  for (var i = 0; i < this.cards.length; i++) {
    this.cardsStack.start[i] = i;
  }
  // give cards to players
  var c = this.cardsStack.start.length - 1;
  for (i = 0; i < this.players.length; i++) {
    for (var j = 0; j < this.players[i].cardsMax; j++) {
      this.players[i].cardsStack.start.push(
        this.cardsStack.start[c]
      );
      // todo: improve to remove array element
      this.cardsStack.start[c] = null;
      c--;
    }
  }

  //console.log(this.cardsStack.start);
  console.log(this.players[0].cardsStack.start);

  this.showCard(71, -70 * sb.pixi.screen.ratio, 0);
  this.showCard(70, -210 * sb.pixi.screen.ratio, 0);
  this.showCard(69, 70 * sb.pixi.screen.ratio, 0);
  this.showCard(68, 210 * sb.pixi.screen.ratio, 0);

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
