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

// wrapper class for pixi stuff

SB.Pixi = function() {
  this.screen = { width: 1280, height: 1024, ratio: 0 };

  // create an new instance of a pixi stage
  this.stage = new PIXI.Stage(0x424242, true); // interactive

  // create a renderer instance.
  this.renderer = PIXI.autoDetectRenderer(
    this.screen.width, this.screen.height, null, true // transparency
  );
  this.autoResizeRenderer();

  this.setFpsCounter();

  var scope = this;
  $(window).resize(function() {
    scope.autoResizeRenderer();
  });

  var loader = [false, {}];
}

SB.Pixi.prototype.constructor = SB.Pixi;

SB.Pixi.prototype.autoResizeRenderer = function() {
  if (this.screen.ratio !== 0) {
    // restore default screen size for new resize action
    this.screen.width = this.screen.baseSize.width;
    this.screen.height = this.screen.baseSize.height;
  } else {
    this.screen.baseSize = { width: this.screen.width, height: this.screen.height };
  }
  // resize display size by current window size
  this.screen.ratio = Math.min(
    window.innerWidth / this.screen.width, window.innerHeight / this.screen.height
  );
  this.screen.width = this.screen.width * this.screen.ratio;
  this.screen.height = this.screen.height * this.screen.ratio;
  this.renderer.resize(this.screen.width, this.screen.height);

  if (window.innerWidth > this.screen.width) {
    $("body").css(
      "padding-left", Math.floor((window.innerWidth - this.screen.width) / 2)+"px"
    );
  }
}

// needs a valid scope to get the active pixi instance!
SB.Pixi.prototype.animate = function(scope) {
  if (sb.userConfig.fps > -1) {
    global.setTimeout(function() { requestAnimFrame(scope.animate.curry(scope)); }, 1000 / sb.userConfig.fps );
  } else {
    requestAnimFrame(scope.animate.curry(scope));
  }
  // optional fpc counter
  if (scope.fps[0] > -1) {
    scope.fps[0]++;
  }

  scope.renderer.render(scope.stage);
}

SB.Pixi.prototype.setLoader = function(activate) {
  if (activate === true) {
    var style = {font: Math.floor(40 * this.screen.ratio) + "px " + "Arial", fill: "FFFFFF"};
    var loaderText = new PIXI.Text("Loading ...", style);
    loaderText.anchor = { x: 0.5, y: 0.5 };
    loaderText.position.x = this.screen.width / 2;
    loaderText.position.y = this.screen.height / 2;
    this.stage.addChild(loaderText);
    this.loader = [true, loaderText];
  } else if (activate === false) {
    this.stage.removeChild(this.loader[1]);
    this.loader = [false, {}];
  }
}

SB.Pixi.prototype.loadAssets = function(callback) {
  /* no graphics yet!!
  this.setLoader(true);
  // note: pixi.js has a bug with tiling sprites, you have to add the single image
  var assetsToLoad = [
    "data/display/gfx/splitted/ti_stars.png",
    "data/display/gfx/packed/gfx.atlas"
  ];
  var assetsToLoad = [];
  loader = new PIXI.AssetLoader(assetsToLoad);
  var scope = this;
  loader.onComplete = function() { callback.call(); scope.setLoader(false); };
  loader.load();*/
  callback.call();
}

SB.Pixi.prototype.setFpsCounter = function(keyEvent, scope) {
  if (typeof keyEvent == "undefined") {
    scope = this;
  }
  if (typeof scope.fps == "undefined") {
    style = {font: Math.floor(15 * scope.screen.ratio) + "px " + "Arial", fill: "FFFFFF"};
    scope.fps = [-1, new PIXI.Text("0", style)]; // fps[0] = -1 => disabled counter
    scope.fps[1].position.x = 5 * scope.screen.ratio;
    scope.fps[1].position.y = 5 * scope.screen.ratio;
    scope.fps[1].visible = false;
  } else {
    if (keyEvent === true && scope.fps[0] < 0) {
      scope.fps[0] = 0;
      scope.fps[1].visible = true;
      sb.intervals["fpsCounter"] = setInterval(scope.setFpsCounter.curry(false, scope), 1000);
      keyEvent = false;
      scope.stage.addChild(scope.fps[1]);
    }
    scope.fps[1].setText(scope.fps[0] < 0 ? 0 : scope.fps[0]);
    scope.fps[0] = 0;
    if (keyEvent === true && scope.fps[0] > -1) {
      clearInterval(sb.intervals["fpsCounter"]);
      scope.fps[1].visible = false;
      scope.fps[0] = -1;
      scope.stage.removeChild(scope.fps[1]);
    }
  }
}
