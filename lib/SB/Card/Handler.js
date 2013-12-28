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

SB.CardHandler = function(display) {

  this.display = display;
  this.cards = [];

  this.cardsMulti = 12;
  this.cardsMax = 12;
  this.placeholderCardsMax = 14;
  this.usedPlaceholderCards = [];

  this.stacks = {
    start : { list: [], visible: "none" },
    target0: { list: [], visible: null },
    target1: { list: [], visible: null },
    target2: { list: [], visible: null },
    target3: { list: [], visible: null },
    players: []
  };
}

SB.CardHandler.prototype.constructor = SB.CardHandler;

SB.CardHandler.prototype.initCards = function() {
  var c = 0;
  for (var i = 1; i <= this.cardsMax; i++) {
    for (var j = 1; j <= this.cardsMulti; j++) {
      this.cards[c] = new SB.Card();
      this.cards[c].value = j;
      this.cards[c].loadGfx();
      c++;
    }
  }
  this.mixCards(3);
  // placeholder cards on fixed positions
  this.initPlaceholderCards();
}

SB.CardHandler.prototype.initPlaceholderCards = function() {
  var offset = this.cards.length, c = 0;
  // placeholder cards for empty stack slots
  for (var i = offset; i < offset + this.placeholderCardsMax; i++) {
    this.cards[i] = new SB.Card();
    this.cards[i].placeholder = true;
    this.cards[i].loadGfx();
    this.usedPlaceholderCards[c] = null;
    c++;
  }
}

SB.CardHandler.prototype.getPlaceholderCardId = function() {
  var offset = this.cards.length - this.placeholderCardsMax;
  for (var i = 0; i < this.placeholderCardsMax; i++) {
    if (this.usedPlaceholderCards[i] === null) {
      this.usedPlaceholderCards[i] = offset + i;
      return this.usedPlaceholderCards[i];
    }
  }
  return null;
}

SB.CardHandler.prototype.removePlaceholderCardId = function(id) {
  for (var i = 0; i < this.placeholderCardsMax; i++) {
    if (this.usedPlaceholderCards[i] == id) {
      this.usedPlaceholderCards[i] = null;
      return true;
    }
  }
  return false;
}

SB.CardHandler.prototype.mixCards = function(rounds, list) {
  var newPosition = 0, card = {};
  if (typeof list == "undefined") {
    list = this.cards; // mix cards on initialization only!
  }
  for (var r = 0; r < rounds; r++) {
    for (var position = 0; position < list.length; position++) {
      newPosition = Math.floor(Math.random() * (list.length - 1));
      card = list[newPosition];
      list[newPosition] = list[position];
      list[position] = card;
    }
  }
}

SB.CardHandler.prototype.moveTargetStackToStart = function(stackId) {
  var tempStack = this.stacks["target"+stackId];
  var listLength = tempStack.list.length;
  if (listLength == this.cardsMulti) {
    console.log("full target stack remove");
    // mix cards first
    this.mixCards(3, tempStack.list);
    for (var i = 0; i < listLength; i++) {
      this.stacks.start.list.splice(0, 0, tempStack.list[i]);
    }
    tempStack.list = [];
  }
}

SB.CardHandler.prototype.initStacks = function(players) {
  for (var i = 0; i < this.cardsMulti * this.cardsMax; i++) {
    this.stacks.start.list[i] = i;
  }
  for (i = 0; i < players.length; i++) {
    this.stacks.players[i] = {
      start : { list: [], visible: null },
      hand : { list: [], visible: "all" },
      temp0 : { list: [], visible: null },
      temp1 : { list: [], visible: null },
      temp2 : { list: [], visible: null },
      temp3 : { list: [], visible: null }
    };
    for (var j = 0; j < players[i].cardsMax; j++) {
      this.stacks.players[i].start.list.push(
        this.stacks.start.list[this.stacks.start.list.length - 1]
      );
      this.stacks.start.list = this.stacks.start.list.slice(
        0, this.stacks.start.list.length-1
      );
    }
    for (j = 0; j < players[i].cardsHandMax; j++) {
      this.stacks.players[i].hand.list[j] = null;
    }
  }
}

SB.CardHandler.prototype.givePlayerHandCards = function(playerId) {
  for (var i = 0; i < this.stacks.players[playerId].hand.list.length; i++) {
    if (this.stacks.players[playerId].hand.list[i] === null) {
      this.stacks.players[playerId].hand.list[i] =
        this.stacks.start.list[this.stacks.start.list.length - 1];
      this.stacks.start.list = this.stacks.start.list.slice(
        0, this.stacks.start.list.length-1
      );
    }
  }
}

SB.CardHandler.prototype.showCard = function(id) {
  if (typeof this.cards[id] != "undefined") {
    this.cards[id].show();
    this.display.addObject(this.cards[id].gfx);
  }
}

SB.CardHandler.prototype.moveCard = function(id, x, y, rotation) {
  if (typeof this.cards[id] != "undefined") {
    this.cards[id].move(x, y, rotation);
  }
}

SB.CardHandler.prototype.hideCard = function(id) {
  if (typeof this.cards[id] != "undefined") {
    this.cards[id].hide();
    this.display.removeObject(this.cards[id].gfx);
  }
}