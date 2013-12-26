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
  this.cardsVisible = {
    all : { pos0: null, pos1: null, pos2: null, pos3: null },
    player0 : { start: null, hand: [], tmp0: null, tmp1: null, tmp2: null, tmp3: null },
    player1 : { start: null, hand: [], tmp0: null, tmp1: null, tmp2: null, tmp3: null },
    player2 : { start: null, hand: [], tmp0: null, tmp1: null, tmp2: null, tmp3: null },
    player3 : { start: null, hand: [], tmp0: null, tmp1: null, tmp2: null, tmp3: null }
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
      this.cards[c] = { value : i, gfx : this.getCardGfx(i, false) };
      c++;
    }
  }
}

SB.Game.prototype.initPlaceholderCards = function() {
  var c = this.cards.length;
  for (var i = 1; i <= 8; i++) {
    this.cards[c] = { value : i, gfx : this.getCardGfx(i, true) };
    c++;
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

SB.Game.prototype.getCardColor = function(value, placeholder) {
  var color = null;
  if (placeholder !== true) {
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

SB.Game.prototype.getCardGfx = function(value, placeholder) {
  var cardGfx = new PIXI.DisplayObjectContainer();
  cardGfx.pivot = {x: 0.5, y: 0.5 };
  cardGfx.position = {x: 0, y: 0 };
  cardGfx.scale = {x: sb.pixi.screen.ratio, y: sb.pixi.screen.ratio};
  cardGfx.visible = false;

  var width = 120, height = 200;
  var gfx = new PIXI.Graphics();
  var color = this.getCardColor(value, placeholder);
  gfx.lineStyle(5, "0x"+color);
  if (placeholder !== true) {
    gfx.beginFill("0xE6E6E6");
  }
  gfx.moveTo(-1 * width / 2, -1 * height / 2);
  gfx.lineTo(1 * width / 2, -1 * height / 2);
  gfx.lineTo(1 * width / 2, 1 * height / 2);
  gfx.lineTo(-1 * width / 2, 1 * height / 2);
  gfx.lineTo(-1 * width / 2, -1 * height / 2);
  if (placeholder !== true) {
    var style = {font: 48 + "px " + "Arial", fill: color};
    var valueText = new PIXI.Text(value, style);
    valueText.anchor = { x: 0.5, y: 0.5 };
    valueText.position = { x: 0, y: 0 };
  }
  cardGfx.addChild(gfx);
  if (placeholder !== true) {
    cardGfx.addChild(valueText);
  }
  // interaction sprite
  var texture = PIXI.Texture.fromImage("data/gfx/blank.png");
  var sprite = new PIXI.Sprite(texture);
  sprite.width = width;
  sprite.height = height;
  sprite.position.x = -1 * width / 2;
  sprite.position.y = -1 * height / 2;
  sprite.setInteractive(true);
  var eventContent = {};
  $.extend(eventContent, {});
  var callback = function(mouse) {
    $.extend(eventContent, { mouse: mouse });
    //element.dispatchEvent( { type: type, content: eventContent } );
    alert(value);
  };
  sprite.click = callback;
  cardGfx.addChild(sprite);

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

  // placeholder cards for empty stacks
  this.initPlaceholderCards();

  // give cards to players
  for (i = 0; i < this.players.length; i++) {
    for (var j = 0; j < this.players[i].cardsMax; j++) {
      this.players[i].cardsStack.start.push(
        this.cardsStack.start[this.cardsStack.start.length - 1]
      );
      this.cardsStack.start = this.cardsStack.start.slice(0, this.cardsStack.start.length-1);
    }
  }
  // give cards to players hand
  for (i = 0; i < this.players.length; i++) {
    for (j = 0; j < this.players[i].cardsHandMax; j++) {
      this.players[i].cardsStack.hand.push(
        this.cardsStack.start[this.cardsStack.start.length - 1]
      );
      this.cardsStack.start = this.cardsStack.start.slice(0, this.cardsStack.start.length-1);
    }
  }

  this.showCards();
}

SB.Game.prototype.showCards = function() {
  // reset middle all pos
  var middlePositions = [
    { x: -210, y: -200 },
    { x: -70, y: -200 },
    { x: 70, y: -200 },
    { x: 210, y: -200 }
  ];
  for (var i = 0; i < middlePositions.length; i++) {
    if (this.cardsVisible.all["pos"+i] !== null) {
      this.hideCard(this.cardsVisible.all["pos"+i]);
      this.cardsVisible.all["pos"+i] = null;
    }
    this.showCard(
      (this.cardsStack["pos"+i].length > 0) ?
        this.cardStack["pos"+i][this.cardsStack["pos"+i].length-1] :
        this.cards.length-8+i,
      middlePositions[i].x * sb.pixi.screen.ratio,
      middlePositions[i].y * sb.pixi.screen.ratio
    );
    this.cardsVisible.all["pos"+i] = (this.cardsStack["pos"+i].length > 0) ?
      this.cardsStack["pos"+i].length-1 : this.cards.length-8+i;
  }
  // reset player0 cards tmp
  var cardsPositions = [
    { x: -310, y: 100 },
    { x: -170, y: 100 },
    { x: -30, y: 100 },
    { x: 110, y: 100 }
  ];
  for (i = 0; i < cardsPositions.length; i++) {
    if (this.cardsVisible.player0["tmp"+i] !== null) {
      this.hideCard(this.cardsVisible.player0["tmp"+i]);
      this.cardsVisible.player0["tmp"+i] = null;
    }
    this.showCard(
      (this.players[0].cardsStack["tmp"+i].length > 0) ?
        this.players[0].cardsStack["tmp"+i][this.players[0].cardsStack["tmp"+i].length-1] :
        this.cards.length-4+i,
      cardsPositions[i].x * sb.pixi.screen.ratio,
      cardsPositions[i].y * sb.pixi.screen.ratio
    );
    this.cardsVisible.player0["tmp"+i] = (this.players[0].cardsStack["tmp"+i].length > 0) ?
      this.players[0].cardsStack["tmp"+i].length-1 :
      this.cards.length-4+i;
  }
  // reset player0 cards start
  if (this.cardsVisible.player0.start !== null) {
    this.hideCard(this.cardsVisible.player0.start);
    this.cardsVisible.player0.start = null;
  }
  if (this.players[0].cardsStack.start.length > 0) {
    this.showCard(
      this.players[0].cardsStack.start[this.players[0].cardsStack.start.length-1],
      300 * sb.pixi.screen.ratio,
      100 * sb.pixi.screen.ratio
    );
    this.cardsVisible.player0.start = this.players[0].cardsStack.start.length-1;
  }
  // reset player0 cards hand
  var cardsHandPositions = [
    { x: -260, y: 400 },
    { x: -130, y: 400 },
    { x: 0, y: 400 },
    { x: 130, y: 400 },
    { x: 260, y: 400 }
  ];
  for (i = 0; i < this.players[0].cardsHandMax; i++) {
    if (typeof this.cardsVisible.player0.hand[i] == "number") {
      this.hideCard(this.cardsVisible.player0.hand[i]);
      this.cardsVisible.player0.hand[i] = null;
    }
    if (typeof this.players[0].cardsStack.hand[i] == "number") {
      this.showCard(
        this.players[0].cardsStack.hand[i],
        cardsHandPositions[i].x * sb.pixi.screen.ratio,
        cardsHandPositions[i].y * sb.pixi.screen.ratio
      );
      this.cardsVisible.player0.hand[i] = this.players[0].cardsStack.hand[i];
    }
  }
}
