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
                                                 cardHandler, sourceStack,
                                                 sourceCardPos, spliceMode
                                               ) {
  var sourceMatch = false;
  var sourceCardId = sourceStack.list[sourceCardPos];
  console.log("source card id", sourceCardId);
  if (typeof sourceCardId === "number") {
    var sourceCardValue = cardHandler.cards[sourceCardId].value;
    console.log("source card value", sourceCardValue);
    // valid open card in source stack, look for target place
    for (var i = 0; i < 4; i++) {
      var targetStack = cardHandler.stacks["target"+i];
      var targetListLength = targetStack.list.length;
      var cardId = targetStack.list[targetListLength-1];
      if (typeof cardId !== "number" && sourceCardValue == 1) {
        // match empty target with source card one
        sourceMatch = true;
      } else if (typeof cardId === "number") {
        var targetCardValue = cardHandler.cards[cardId].value;
        if (targetCardValue == sourceCardValue - 1) {
          // match open target card with start card number
          sourceMatch = true;
        }
      }
      if (sourceMatch === true) {
        // move start card to target stack
        targetStack.list.push(sourceStack.list[sourceCardPos]);
        if (spliceMode === true) {
          sourceStack.list.splice(sourceCardPos, 1);
        } else {
          console.log("hand remove", sourceCardPos);
          sourceStack.list[sourceCardPos] = null;
        }
        return true;
      }
    }
  }
  return false;
}

SB.Player.prototype.cpuTurn = function(game, playerId) {
  var match = false, tmpMatch = false;
  console.log("playerId", playerId);
  // check open start stack first
  var startStack = game.cardHandler.stacks.players[playerId].start;
  var startListLength = startStack.list.length;
  if (startListLength > 0) {
    match = this.cpuMoveCardToTargetStack(
      game.cardHandler, startStack, startListLength-1, true
    );
    console.log("start", match);
  }
  // check open hand cards second
  for (var i = 0; i < this.cardsHandMax; i++) {
    tmpMatch = this.cpuMoveCardToTargetStack(
      game.cardHandler, game.cardHandler.stacks.players[playerId].hand, i, false
    );
    if (tmpMatch === true) {
      match = true;
    }
    console.log("hand", tmpMatch);
  }
  // check open temp cards third
  for (var i = 0; i < 4; i++) {
    var tempStack = game.cardHandler.stacks.players[playerId]["temp"+i];
    var tempListLength = tempStack.list.length;
    tmpMatch = this.cpuMoveCardToTargetStack(
      game.cardHandler, tempStack, tempListLength-1, true
    );
    if (tmpMatch === true) {
      match = true;
    }
    console.log("temp", tmpMatch);
  }

  // repeat checks until no further match
  game.updateCards();
  if (match === true) {
    this.cpuTurn(game, playerId);

  } else {
    // put hand card to temp stack if no more actions are possible

    // check hand cards and temp cards lower one
    tmpMatch = false;
    for (var i = 0; i < this.cardsHandMax; i++) {
      var handCardId = game.cardHandler.stacks.players[playerId].hand.list[i];
      if (handCardId === "number") {
        var handCardValue = game.cardHandler.cards[handCardId].value;
        for (var j = 0; j < 4; j++) {
          var tempStack = game.cardHandler.stacks.players[playerId]["temp"+j];
          if (tempStack.list.length > 0) {
            var tempCardId = tempStack.list[tempStack.list.length-1];
            if (tempCardId === "number") {
              var tempCardValue = game.cardHandler.cards[tempCardId].value;
              if (tempCardValue + 1 == handCardValue) {
                tempStack.list.push(handCardId);
                game.cardHandler.stacks.players[playerId].hand.list[i] = null;
                tmpMatch = true;
              }
            }
          }
          if (tmpMatch === true) break;
        }
      }
      if (tmpMatch === true) break;
    }

    // simple card selections (todo add more checks for better selection)
    if (tmpMatch === false) {
      var handCardPos = Math.floor(Math.random() * (this.cardsHandMax-1));
      var tempStackPos = Math.floor(Math.random() * 3);
      console.log("hand card to temp", handCardPos, tempStackPos);
      game.cardHandler.stacks.players[playerId]["temp"+tempStackPos].list.push(
        game.cardHandler.stacks.players[playerId].hand.list[handCardPos]
      );
      game.cardHandler.stacks.players[playerId].hand.list[handCardPos] = null;
    }
    game.updateCards();
  }
}