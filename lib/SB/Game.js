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

  this.layout = new SB.Layout();
  this.display = new SB.Display();
  this.display.initialize();

  this.display.addTurnButton();

  this.players = [
    new SB.Player(),
    new SB.Player(true),
    new SB.Player(true),
    new SB.Player(true)
  ];
  this.currentPlayer = 0;

  this.cardHandler = new SB.CardHandler(this.display, this.players);
  this.clickPath = [];
  this.turnFinish = false;
}

SB.Game.prototype = Object.create(SB.Element.prototype);
SB.Game.prototype.constructor = SB.Game;

SB.Game.prototype.start = function() {

  this.cardHandler.initCards();
  this.cardHandler.initStacks(this.players);

  // give cards to players hand
  for (i = 0; i < this.players.length; i++) {
    this.cardHandler.givePlayerHandCards(i);
  }

  this.updateCards();

  this.addEventListener('carddown', sb.util.getEventListener(this, "handleEvent"));
  this.addEventListener('turndown', sb.util.getEventListener(this, "handleEvent"));
}

SB.Game.prototype.updateCards = function() {
  var i = 0, cardId = null, listLength = null, ratio = sb.pixi.screen.ratio;
  // reset target stacks cards
  for (i = 0; i < this.layout.targetStacks.length; i++) {
    cardId = this.cardHandler.stacks["target"+i].visible;
    if (cardId !== null) {
      this.cardHandler.removePlaceholderCardId(cardId);
      this.cardHandler.hideCard(cardId);
      this.cardHandler.stacks["target"+i].visible = null;
    }
    // check for full stack to move all cards to start stack first
    this.cardHandler.moveTargetStackToStart(i);
    listLength = this.cardHandler.stacks["target"+i].list.length;
    cardId = (listLength > 0) ?
      this.cardHandler.stacks["target"+i].list[listLength-1] :
      this.cardHandler.getPlaceholderCardId();
    this.cardHandler.moveCard(
      cardId,
      this.layout.targetStacks[i].x * ratio,
      this.layout.targetStacks[i].y * ratio
    );
    this.cardHandler.showCard(cardId);
    this.cardHandler.stacks["target"+i].visible = cardId;
  }
  // reset player0 temp stacks cards
  for (i = 0; i < this.layout.playerTempStacks.length; i++) {
    cardId = this.cardHandler.stacks.players[0]["temp"+i].visible;
    if (cardId !== null) {
      this.cardHandler.removePlaceholderCardId(cardId);
      this.cardHandler.hideCard(cardId);
      this.cardHandler.stacks.players[0]["temp"+i].visible = null;
    }
    listLength = this.cardHandler.stacks.players[0]["temp"+i].list.length;
    cardId = (listLength > 0) ?
      this.cardHandler.stacks.players[0]["temp"+i].list[listLength-1] :
      this.cardHandler.getPlaceholderCardId();
    this.cardHandler.moveCard(
      cardId,
      this.layout.playerTempStacks[i].x * ratio,
      this.layout.playerTempStacks[i].y * ratio
    );
    this.cardHandler.showCard(cardId);
    this.cardHandler.stacks.players[0]["temp"+i].visible = cardId;
  }
  // reset player0 start stack card
  cardId = this.cardHandler.stacks.players[0].start.visible;
  if (cardId !== null) {
    this.cardHandler.removePlaceholderCardId(cardId);
    this.cardHandler.hideCard(cardId);
    this.cardHandler.stacks.players[0].start.visible = null;
  }
  listLength = this.cardHandler.stacks.players[0].start.list.length;
  cardId = (listLength > 0) ?
    this.cardHandler.stacks.players[0].start.list[listLength-1] :
    this.cardHandler.getPlaceholderCardId();
  this.cardHandler.moveCard(
    cardId,
    this.layout.playerStartStack.x * ratio,
    this.layout.playerStartStack.y * ratio
  );
  this.cardHandler.showCard(cardId);
  this.cardHandler.stacks.players[0].start.visible = cardId;
  // reset player0 hand stack cards
  for (i = 0; i < this.layout.playerHandStack.length; i++) {
    cardId = typeof this.cardHandler.stacks.players[0].hand.list[i] === "number" ?
      this.cardHandler.stacks.players[0].hand.list[i] :
      this.cardHandler.getPlaceholderCardId();
    this.cardHandler.moveCard(
      cardId,
      this.layout.playerHandStack[i].x * ratio,
      this.layout.playerHandStack[i].y * ratio
    );
    this.cardHandler.showCard(cardId);
  }
}

SB.Game.prototype.handleEvent = function(scope, event) {
  if (event.type == "turndown" && scope.turnFinish == true) {
    // click event on turn end button
    // do cpu player turns and give cards to fill empty hand cards
    for (i = 1; i < this.players.length; i++) {
      scope.cardHandler.givePlayerHandCards(i);
      scope.players[i].cpuTurn(scope, i);
    }
    // give cards to human player for next human turn
    scope.cardHandler.givePlayerHandCards(0);
    scope.updateCards();
    scope.turnFinish = false;

  } else if (event.type == "carddown" && scope.turnFinish == false) {
    // click event on card interaction layer
    // determine card area position and set card values to click path
    var ratio = sb.pixi.screen.ratio, reset = true, evc = event.content;
    var position = evc.mouse.target.parent.position,
        card = evc.card, targetCardObj = evc.mouse.target.parent,
        value = evc.value;

    if ((position.x >= -250 * ratio || position.x <= 260 * ratio) &&
        position.y == 400 * ratio) {
      // target hand card
      // determine stack card position to switch stack later correctly
      var stackPosition = -1;
      for (var i = 0; i < scope.layout.playerHandStack.length; i++) {
        if (position.x == scope.layout.playerHandStack[i].x * ratio) {
          stackPosition = i;
          break;
        }
      }
      // save stack card data in click path to handle card later
      scope.clickPath = [{
        type: "player0 hand card",
        card: card,
        value: value,
        object: targetCardObj,
        stackPosition : stackPosition
      }];
      reset = false;

    } else if (position.x == 300 * ratio && position.y == 100 * ratio) {
      // target start card
      scope.clickPath = [{
        type: "player0 start card",
        card: card,
        value: value,
        object: targetCardObj
      }];
      reset = false;

    } else if ((position.x >= -360 * ratio || position.x <= 110 * ratio) &&
               position.y == 100 * ratio) {
      // determine stack card position to switch stack correctly
      var stackPosition = -1;
      for (var i = 0; i < scope.layout.playerTempStacks.length; i++) {
        if (position.x == scope.layout.playerTempStacks[i].x * ratio) {
          stackPosition = i;
          break;
        }
      }
      // target temp card
      if (scope.clickPath.length == 1 &&
          scope.clickPath[0].type == "player0 hand card") {
        // move hand card to temp stack
        scope.cardHandler.stacks.players[0]["temp"+stackPosition].list.push(
          scope.cardHandler.stacks.players[0].hand.list[
            scope.clickPath[0].stackPosition
          ]
        );
        scope.cardHandler.stacks.players[0].hand.list[
          scope.clickPath[0].stackPosition
        ] = null;
        // update visible cards
        scope.updateCards();
        scope.turnFinish = true;

      } else if (scope.clickPath.length == 0) {
        scope.clickPath.push({
          type: "player0 temp card",
          card: card,
          value: value,
          object: targetCardObj,
          stackPosition: stackPosition
        });
        reset = false;
      }

    } else if ((position.x >= -210 * ratio || position.x <= 210 * ratio) &&
               position.y == -200 * ratio) {
      // target all card
      if (scope.clickPath.length == 1 &&
          (scope.clickPath[0].type == "player0 hand card" ||
           scope.clickPath[0].type == "player0 start card" ||
           scope.clickPath[0].type == "player0 temp card")) {
        // determine stack card position to switch stack correctly
        var stackPosition = -1;
        for (var i = 0; i < scope.layout.targetStacks.length; i++) {
          if (position.x == scope.layout.targetStacks[i].x * ratio) {
            stackPosition = i;
            break;
          }
        }
        // check correct card value order
        if ((value === null && scope.clickPath[0].value == 1) ||
            value + 1 == scope.clickPath[0].value) {
          // todo move last active card to target stack by type
          if (scope.clickPath[0].type == "player0 hand card") {
            // move hand card to target stack
            scope.cardHandler.stacks["target"+stackPosition].list.push(
              scope.cardHandler.stacks.players[0].hand.list[
                scope.clickPath[0].stackPosition
              ]
            );
            scope.cardHandler.stacks.players[0].hand.list[
              scope.clickPath[0].stackPosition
            ] = null;
          } else if (scope.clickPath[0].type == "player0 start card") {
            var startStack = scope.cardHandler.stacks.players[0].start;
            var startListLength = startStack.list.length;
            scope.cardHandler.stacks["target"+stackPosition].list.push(
              startStack.list[startListLength - 1]
            );
            startStack.list = startStack.list.slice(0, startListLength - 1);
            startStack.visible = null;
          } else if (scope.clickPath[0].type == "player0 temp card") {
            var tempStack = scope.cardHandler.stacks.players[0]["temp"+scope.clickPath[0].stackPosition];
            var tempListLength = tempStack.list.length;
            // move hand card to target stack
            scope.cardHandler.stacks["target"+stackPosition].list.push(
              tempStack.list[tempListLength - 1]
            );
            tempStack.list = tempStack.list.slice(0, tempListLength - 1);
            tempStack.visible = null;
          }
          // update visible cards
          scope.updateCards();
        }
      }
    }

    if (reset === true) {
      scope.clickPath = [];
    }
  }
}
