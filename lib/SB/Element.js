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

// game element class
// not much content yet, just good to detect elements in display scenes to get layouts
// whith display objects

SB.Element = function(name, randomNamePrefix) {
  this.name = name || ((randomNamePrefix || "random") + Math.floor(Math.random() * 1000));
  // use pixi event target to handle display object interaction events
  // see -> https://github.com/MKelm/pixi.js/blob/dev/src/pixi/utils/EventTarget.js
  PIXI.EventTarget.call(this);
}

SB.Element.prototype.constructor = SB.Element;

// generic element function to handle events as event listener, expand in derevations
// use SB.Util.getEventListener to create callback functions with correct scope transfer
SB.Element.prototype.handleEvent = function(scope, event) {
}
