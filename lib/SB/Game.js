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
  this.initDisplay();

  this.cardHandler = new SB.CardHandler(this.display);
  this.clickPath = [];

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

SB.Game.prototype.start = function() {

  this.cardHandler.initCards();

  // put general cards to start stock
  for (var i = 0; i < this.cardHandler.cardsMulti * this.cardHandler.cardsMax; i++) {
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

  this.addEventListener('mousedown', sb.util.getEventListener(this, "handleEvent"));
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
      this.cardHandler.hideCard(this.cardsVisible.all["pos"+i]);
      this.cardsVisible.all["pos"+i] = null;
    }
    var cardId = (this.cardsStack["pos"+i].length > 0) ?
      this.cardStack["pos"+i][this.cardsStack["pos"+i].length-1] :
      this.cardHandler.cards.length-14+i;
    this.cardHandler.moveCard(
      cardId,
      middlePositions[i].x * sb.pixi.screen.ratio,
      middlePositions[i].y * sb.pixi.screen.ratio
    );
    this.cardHandler.showCard(cardId);
    this.cardsVisible.all["pos"+i] = cardId;
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
      this.cardHandler.hideCard(this.cardsVisible.player0["tmp"+i]);
      this.cardsVisible.player0["tmp"+i] = null;
    }
    var cardId = (this.players[0].cardsStack["tmp"+i].length > 0) ?
      this.players[0].cardsStack["tmp"+i][this.players[0].cardsStack["tmp"+i].length-1] :
      this.cardHandler.cards.length-10+i;
    this.cardHandler.moveCard(
      cardId,
      cardsPositions[i].x * sb.pixi.screen.ratio,
      cardsPositions[i].y * sb.pixi.screen.ratio
    );
    this.cardHandler.showCard(cardId);
    this.cardsVisible.player0["tmp"+i] = cardId;
  }
  // reset player0 cards start
  if (this.cardsVisible.player0.start !== null) {
    this.cardHandler.hideCard(this.cardsVisible.player0.start);
    this.cardsVisible.player0.start = null;
  }
  if (this.players[0].cardsStack.start.length > 0) {
    var cardId = this.players[0].cardsStack.start[this.players[0].cardsStack.start.length-1];
    this.cardHandler.moveCard(
      cardId,
      300 * sb.pixi.screen.ratio,
      100 * sb.pixi.screen.ratio
    );
    this.cardHandler.showCard(cardId);
    this.cardsVisible.player0.start = cardId;
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
      this.cardHandler.hideCard(this.cardsVisible.player0.hand[i]);
      this.cardsVisible.player0.hand[i] = null;
    }
    if (typeof this.players[0].cardsStack.hand[i] == "number") {
      var cardId = this.players[0].cardsStack.hand[i];
      this.cardHandler.moveCard(
        cardId,
        cardsHandPositions[i].x * sb.pixi.screen.ratio,
        cardsHandPositions[i].y * sb.pixi.screen.ratio
      );
      this.cardHandler.showCard(cardId);
      this.cardsVisible.player0.hand[i] = cardId;
    }
  }
}

SB.Game.prototype.handleEvent = function(scope, event) {
  if (event.type == "mousedown") {
    // determine card area position and set card values to click path
    var ratio = sb.pixi.screen.ratio, reset = true, evc = event.content;
    var position = evc.mouse.target.parent.position,
        card = evc.card,
        value = evc.value;
    if ((position.x >= -250 * ratio || position.x <= 260 * ratio) &&
        position.y == 400 * ratio) {
      // target hand card
      this.clickPath = [{ type: "player0 hand card", card: card, value: value, object: evc.mouse.target.parent }];
      reset = false;
    } else if (position.x == 300 * ratio && position.y == 100 * ratio) {
      // target start card
      this.clickPath = [{ type: "player0 start card", card: card, value: value, object: evc.mouse.target.parent }];
      reset = false;
    } else if ((position.x >= -360 * ratio || position.x <= 110 * ratio) &&
               position.y == 100 * ratio) {
      // target tmp card
      if (this.clickPath.length == 1 &&
          this.clickPath[0].type == "player0 hand card") {
        // switch placeholder / hand card position
        // todo better handling for placeholders!!!
        var tmpPos = evc.mouse.target.parent.position;
        evc.mouse.target.parent.position = this.clickPath[0].object.position;
        this.clickPath[0].object.position = tmpPos;
        this.clickPath.push({ type: "player0 tmp card", card: card, value: value });
        reset = false;
      }
    } else if ((position.x >= -210 * ratio || position.x <= 210 * ratio) &&
               position.y == -200 * ratio) {
      // target all card
      if (this.clickPath.length == 1 &&
          (this.clickPath[0].type == "player0 hand card" ||
           this.clickPath[0].type == "player0 start card" ||
           this.clickPath[0].type == "player0 tmp card")) {
        this.clickPath.push({ type: "all card", card: card, value: value });
        reset = false;
      }
    }
    if (reset === true) {
      this.clickPath = [];
    }
    console.log(this.clickPath);
  }
}
