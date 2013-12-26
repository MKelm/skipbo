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
  this.cardsMulti = 12;
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

SB.Game.prototype.showCard = function(cardId, x, y, rotation) {
  this.cards[cardId].gfx.position = { x: x, y: y };
  this.cards[cardId].gfx.visible = true;
  this.cards[cardId].gfx.rotation = (rotation > 0) ? rotation : 0;
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
  for (i = 0; i < this.players.length; i++) {
    for (var j = 0; j < this.players[i].cardsMax; j++) {
      this.players[i].cardsStack.start.push(
        this.cardsStack.start[this.cardsStack.start.length - 1]
      );
      this.cardsStack.start = this.cardsStack.start.slice(0, this.cardsStack.start.length-1);
    }
  }

  //console.log(this.cards);
  console.log(this.players[0].cardsStack.start);
  console.log(this.cardsStack.start);

  // todo use stack for positions
  this.showCard(71, -70 * sb.pixi.screen.ratio, 0);
  this.showCard(70, -210 * sb.pixi.screen.ratio, 0);
  this.showCard(69, 70 * sb.pixi.screen.ratio, 0);
  this.showCard(68, 210 * sb.pixi.screen.ratio, 0);

  // todo use stack for player0 positions
  this.showCard(66, -320 * sb.pixi.screen.ratio, 300);
  this.showCard(67, -180 * sb.pixi.screen.ratio, 300);
  this.showCard(65, -40 * sb.pixi.screen.ratio, 300);
  this.showCard(64, 100 * sb.pixi.screen.ratio, 300);

  this.showCard(
    this.players[0].cardsStack.start[this.players[0].cardsStack.start.length-1],
    300 * sb.pixi.screen.ratio, 300
  );
  console.log(this.players[0].cardsStack.start[this.players[0].cardsStack.start.length-1]);

  // todo use stack for player1 positions
  this.showCard(63, 400, -70 * sb.pixi.screen.ratio, 1.55);
  this.showCard(62, 400, -210 * sb.pixi.screen.ratio, 1.55);
  this.showCard(61, 400, 70 * sb.pixi.screen.ratio, 1.55);
  this.showCard(60, 400, 210 * sb.pixi.screen.ratio, 1.55);

  // todo use stack for player2 positions
  this.showCard(59, -70 * sb.pixi.screen.ratio, -300);
  this.showCard(58, -210 * sb.pixi.screen.ratio, -300);
  this.showCard(57, 70 * sb.pixi.screen.ratio, -300);
  this.showCard(56, 210 * sb.pixi.screen.ratio, -300);

  // todo use stack for player3 positions
  this.showCard(55, -400, -70 * sb.pixi.screen.ratio, 1.55);
  this.showCard(54, -400, -210 * sb.pixi.screen.ratio, 1.55);
  this.showCard(53, -400, 70 * sb.pixi.screen.ratio, 1.55);
  this.showCard(51, -400, 210 * sb.pixi.screen.ratio, 1.55);

}
