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

SB.Player = function(cpu) {
  SB.Element.call(this, "player", false);

  this.cpu = cpu || false;

  this.cardsMax = 20;
  this.cardsHandMax = 5;
}

SB.Player.prototype = Object.create(SB.Element.prototype);
SB.Player.prototype.constructor = SB.Player;

SB.Player.prototype.cpuTurn = function(game) {
  var match = false;
  // check open start stack first
  var startStack = game.cardHandler.stacks.players[0].start,
    targetStack = null, targetListLength = null, cardId = null,
    startListLength = null, startCardId = null;
  startListLength = startStack.list.length;
  if (startListLength > 0) {
    var startCardId = startStack.list[startListLength-1];
    if (startCardId === "number") {
      var startCardValue = game.cardHandler.cards[startCardId].value;
      // valid open card in start stack, look for target place
      for (var i = 0; i < 4; i++) {
        targetStack = game.cardHandler.stacks["target"+i];
        targetListLength = targetStack.list.length;
        cardId = targetStack.list.slice(targetListLength-1)[0];
        if (typeof cardId !== "number" && startCardValue == 1) {
          // match empty target with start card one
          match = true;
        } else if (typeof cardId === "number") {
          var targetCardValue = game.cardHandler.cards[cardId].value;
          if (targetCardValue == startCardValue - 1) {
            // match open target card with start card number
            match = true;
          }
        }
        if (match === true) {
          // move start card to target stack
          targetStack.list.push(

          );
        }
      }
    }
  }
  // check open hand cards second

  // check open temp cards third

  game.updateCards();
  // repeat checks until no further match
  /*if (match === true) {
    this.cpuTurn(game);
  }*/
}