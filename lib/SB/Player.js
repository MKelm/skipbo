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

SB.Player.prototype.cpuMoveCardToTargetStack = function(
                                                 sourceStack, sourceCardPos
                                               ) {
  var sourceMatch = false;
  var sourceCardId = sourceStack.list[sourceCardPos];

  if (sourceCardId === "number") {
    var sourceCardValue = game.cardHandler.cards[sourceCardId].value;
    // valid open card in source stack, look for target place
    for (var i = 0; i < 4; i++) {
      var targetStack = game.cardHandler.stacks["target"+i];
      var targetListLength = targetStack.list.length;
      var cardId = targetStack.list[targetListLength-1];
      if (typeof cardId !== "number" && sourceCardValue == 1) {
        // match empty target with source card one
        startMatch = true;
      } else if (typeof cardId === "number") {
        var targetCardValue = game.cardHandler.cards[cardId].value;
        if (targetCardValue == sourceCardValue - 1) {
          // match open target card with start card number
          startMatch = true;
        }
      }
      if (startMatch === true) {
        // move start card to target stack
        targetStack.list.push(
          sourceCardStack.list[sourceCardPos]
        );
        sourceStack.list.splice(sourceCardPos, 1);
        return true;
      }
    }
  }
  return false;
}

SB.Player.prototype.cpuTurn = function(game) {
  var match = false, tmpMatch = false;
  // check open start stack first
  var startStack = game.cardHandler.stacks.players[0].start;
  var startListLength = startStack.list.length;
  if (startListLength > 0) {
    match = this.cpuMoveCardToTargetStack(startStack, startListLength-1);
    console.log("start", match);
  }
  // check open hand cards second
  for (var i = 0; i < this.cardsHandMax; i++) {
    tmpMatch = this.cpuMoveCardToTargetStack(
      game.cardHandler.stacks.players[0].hand, i
    );
    if (tmpMatch === true) {
      match = true;
    }
    console.log("hand", tmpMatch);
  }
  // check open temp cards third
  for (var i = 0; i < 4; i++) {
    var tempStack = game.cardHandler.stacks.players[0]["temp"+i];
    var tempListLength = tempStack.list.length;
    tmpMatch = this.cpuMoveCardToTargetStack(tempStack, tempListLength-1);
    if (tmpMatch === true) {
      match = true;
    }
    console.log("temp", match);
  }

  game.updateCards();
  // repeat checks until no further match
  if (match === true) {
    this.cpuTurn(game);
  }
}