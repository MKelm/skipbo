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
}

SB.CardHandler.prototype.constructor = SB.CardHandler;

SB.CardHandler.prototype.initCards = function() {
  var c = 0;
  for (var i = 1; i <= this.cardsMax; i++) {
    for (var j = 1; j <= this.cardsMulti; j++) {
      this.cards[c] = new SB.Card();
      this.cards[c].value = j;
      this.cards[c].loadGfx();
    }
  }
  this.mixCards(3);
  // placeholder cards on fixed positions
  this.initPlaceholderCards();
}

SB.CardHandler.prototype.initPlaceholderCards = function() {
  var offset = this.cards.length;
  // placeholder cards for 14 stack slots
  for (var i = offset; i < offset + this.placeholderCardsMax; i++) {
    this.cards[i] = new SB.Card();
    this.cards[i].placeholder = true;
    this.cards[i].loadGfx();
  }
}

SB.CardHandler.prototype.mixCards = function(rounds) {
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

SB.CardHandler.prototype.showCard = function(id) {
  if (typeof this.cards[id] != "undefined") {
    this.cards[id].show();
    this.display.addChild(this.cards[id].gfx);
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
    this.display.removeChild(this.cards[id].gfx);
  }
}