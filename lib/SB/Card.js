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

SB.Card = function() {
  SB.Element.call(this, "card", false);

  this.value = null;
  this.gfx = null;
  this.placeholder = false;
}

SB.Card.prototype = Object.create(SB.Element.prototype);
SB.Card.prototype.constructor = SB.Card;

SB.Card.prototype.getColor = function() {
  var color = null;
  if (this.placeholder !== true) {
    if (this.value < 5) {
      color = "008B9F";
    } else if (this.value < 9) {
      color = "0F9F00";
    } else if (this.value < 13) {
      color = "CD0092";
    }
  } else {
    color = "000B7C";
  }
  return color;
}

SB.Card.prototype.loadGfx = function() {
  var cardGfx = new PIXI.DisplayObjectContainer();
  cardGfx.pivot = {x: 0.5, y: 0.5 };
  cardGfx.position = {x: 0, y: 0 };
  cardGfx.scale = {x: sb.pixi.screen.ratio, y: sb.pixi.screen.ratio};
  cardGfx.visible = false;

  var width = 120, height = 200;
  var gfx = new PIXI.Graphics();
  var color = this.getColor();

  gfx.lineStyle(5, "0x"+color);
  if (this.placeholder !== true) {
    gfx.beginFill("0xE6E6E6");
  }
  gfx.moveTo(-1 * width / 2, -1 * height / 2);
  gfx.lineTo(1 * width / 2, -1 * height / 2);
  gfx.lineTo(1 * width / 2, 1 * height / 2);
  gfx.lineTo(-1 * width / 2, 1 * height / 2);
  gfx.lineTo(-1 * width / 2, -1 * height / 2);
  if (this.placeholder !== true) {
    var style = {font: 48 + "px " + "Arial", fill: color};
    var valueText = new PIXI.Text(this.value, style);
    valueText.anchor = { x: 0.5, y: 0.5 };
    valueText.position = { x: 0, y: 0 };
  }
  cardGfx.addChild(gfx);
  if (this.placeholder !== true) {
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
  $.extend(
    eventContent,
    { card: (this.placeholder === true) ? "placeholder" : "general", value: this.value }
  );
  var scope = this;
  var callback = function(mouse) {
    $.extend(eventContent, { mouse: mouse });
    sb.game.dispatchEvent( { type: "mousedown", content: eventContent } );
  };
  sprite.click = callback;
  cardGfx.addChild(sprite);
  this.gfx = cardGfx;
}

SB.Card.prototype.show = function() {
  this.gfx.visible = true;
}

SB.Card.prototype.move = function(x, y, rotation) {
  this.gfx.position = { x: x, y: y };
  this.gfx.rotation = (rotation > 0) ? rotation : 0;
}

SB.Card.prototype.hide = function() {
  this.gfx.visible = false;
}