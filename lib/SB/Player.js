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
  this.cardsStack = {
    start : [],
    hand : [],
    tmp0 : [],
    tmp1 : [],
    tmp2 : [],
    tmp3 : []
  };
}

SB.Player.prototype = Object.create(SB.Element.prototype);
SB.Player.prototype.constructor = SB.Player;
