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

// javascript extensions

// curry feature for functions, to create callback functions (with parameters)
Function.prototype.curry = function() {
  if (arguments.length < 1) {
    return this;
  }
  var __method = this;
  var args = Array.prototype.slice.call(arguments); // can be outsourced to toArray(..)
  return function() {
    return __method.apply(this, args.concat(Array.prototype.slice.call(arguments)));
  }
}
