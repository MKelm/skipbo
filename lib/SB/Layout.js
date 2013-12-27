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

SB.Layout = function() {
  SB.Element.call(this, "layout", false);

  // show last cards of target stacks
  this.targetStacks = [
    { x: -210, y: -200 },
    { x: -70, y: -200 },
    { x: 70, y: -200 },
    { x: 210, y: -200 }
  ];

  // show last cards of temp stacks
  this.playerTempStacks = [
    { x: -310, y: 100 },
    { x: -170, y: 100 },
    { x: -30, y: 100 },
    { x: 110, y: 100 }
  ];

  // show last card of start stack
  this.playerStartStack = {
    x: 300, y: 100
  };

  // show all cards of hand stack
  this.playerHandStack = [
    { x: -260, y: 400 },
    { x: -130, y: 400 },
    { x: 0, y: 400 },
    { x: 130, y: 400 },
    { x: 260, y: 400 }
  ];
}

SB.Layout.prototype = Object.create(SB.Element.prototype);
SB.Layout.prototype.constructor = SB.Layout;