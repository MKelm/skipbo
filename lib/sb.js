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

// global sbx object initialization
var sb = sb || {};

$(document).ready(function() {
  global.setTimeout(function() {
    //try {
      sb.util = new SB.Util();

      sb.version = new SB.Version();
      sb.version.updateHashesFile(); // for maintainer

      sb.userConfig = sb.util.loadJSON('./user/data/config.json');
      sb.intervals = {};
      sb.pixi = new SB.Pixi();

      sb.game = new SB.Game();

      // add/start the pixi renderer
      document.body.appendChild(sb.pixi.renderer.view);
      requestAnimFrame(sb.pixi.animate.curry(sb.pixi));

      sb.pixi.loadAssets(function() { sb.game.start(); });

    //} catch (err) {
      //console.log(err);
    //}
  }, 0.00000001); // use timeout to detect fullscreen size correctly
});
