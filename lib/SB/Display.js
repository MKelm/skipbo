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

SB.Display = function() {
  SB.Element.call(this, "display", false);

  this.container = null;
}

SB.Display.prototype = Object.create(SB.Element.prototype);
SB.Display.prototype.constructor = SB.Display;

SB.Display.prototype.initialize = function() {
  this.container = new PIXI.DisplayObjectContainer();
  this.container.pivot = {x: 0.5, y: 0.5 };
  this.container.position = {x: sb.pixi.screen.width/2, y: sb.pixi.screen.height/2 };

  this.container.scale = {x: sb.pixi.screen.ratio, y: sb.pixi.screen.ratio};
  sb.pixi.stage.addChild(this.container);
}

SB.Display.prototype.addObject = function(object) {
  this.container.addChild(object);
}

SB.Display.prototype.removeObject = function(object) {
  this.container.removeChild(object);
}

SB.Display.prototype.addTurnButton = function() {
  var turnGfx = new PIXI.DisplayObjectContainer();
  turnGfx.pivot = {x: 0.5, y: 0.5 };
  turnGfx.position = {
    x: 500 * sb.pixi.screen.ratio, y: -500 * sb.pixi.screen.ratio
  };
  turnGfx.scale = {x: sb.pixi.screen.ratio, y: sb.pixi.screen.ratio};

  var gfx = new PIXI.Graphics();
  gfx.beginFill("0xFF3535");
  gfx.drawRect(0, 0, 50, 50);
  turnGfx.addChild(gfx);

  var texture = PIXI.Texture.fromImage("data/gfx/blank.png");
  var sprite = new PIXI.Sprite(texture);
  sprite.width = 50;
  sprite.height = 50;
  sprite.setInteractive(true);
  var eventContent = {};
  var callback = function(mouse) {
    $.extend(eventContent, { mouse: mouse });
    sb.game.dispatchEvent( { type: "turndown", content: eventContent } );
  };
  sprite.click = callback;
  turnGfx.addChild(sprite);

  this.addObject(turnGfx);
}