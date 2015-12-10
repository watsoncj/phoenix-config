/* jshint node: true, -W030 */
/* globals Phoenix, Window, Modal, Screen, _ */
'use strict';

var keys = [];
var cmd = ['cmd'];
var cmdAlt = ['cmd', 'alt'];

var grids = {
  '1 Up': {rows: 1, cols: 1},
  '2 Up': {rows: 1, cols: 2},
  '3 Up': {rows: 1, cols: 3},
  '4 Up': {rows: 2, cols: 2},
  '6 Up': {rows: 2, cols: 3},
  '9 Up': {rows: 3, cols: 3},
};

function grid(name) {
  var rows = grids[name].rows;
  var cols = grids[name].cols;
  return function applyGrid() {
    var windows = Window.visibleWindowsInOrder();
    windows.splice(Math.min(windows.length, cols*rows));
    var pre = windows.length;
    var sFrame = Screen.mainScreen().visibleFrameInRectangle();
    var width = Math.round(sFrame.width / cols);
    var height = Math.round(sFrame.height / rows);

    var x = sFrame.x;
    var y = sFrame.y;
    _.times(cols, function(col) {
      _.times(rows, function(row) {
        var n = col + (row*cols);
        var rect = {x: x + (col*width), y: y + (row*height), width: width, height: height};
        if (windows.length > n) {
          windows[n].setFrame(rect);
        }
      });
    });
  };
}

keys.push(Phoenix.bind('1', cmd, grid('1 Up')));
keys.push(Phoenix.bind('2', cmd, grid('2 Up')));
keys.push(Phoenix.bind('3', cmd, grid('3 Up')));
keys.push(Phoenix.bind('4', cmd, grid('4 Up')));
keys.push(Phoenix.bind('6', cmd, grid('6 Up')));
keys.push(Phoenix.bind('9', cmd, grid('9 Up')));

function moveFocusFn(dir) {
  return function moveFocus() {
    var fnNames = {
      h: 'focusClosestWindowInWest',
      j: 'focusClosestWindowInSouth',
      k: 'focusClosestWindowInNorth',
      l: 'focusClosestWindowInEast'
    };
    Window.focusedWindow()[fnNames[dir]]();
  };
}

keys.push(Phoenix.bind('h', cmdAlt, moveFocusFn('h')));
keys.push(Phoenix.bind('j', cmdAlt, moveFocusFn('j')));
keys.push(Phoenix.bind('k', cmdAlt, moveFocusFn('k')));
keys.push(Phoenix.bind('l', cmdAlt, moveFocusFn('l')));

function showCenteredModal(message, offset) {
  var m = new Modal();
  m.duration = 0.5;
  m.message = message;

  var sFrame = Screen.mainScreen().visibleFrameInRectangle();
  var mFrame = m.frame();

  var mX = Math.round((sFrame.width / 2) - (mFrame.width / 2));
  var mY = Math.round((sFrame.height / 2) - (mFrame.height / 2));
  if (!offset) {
    offset = {x: 0, y: 0};
  }

  m.origin = {x: sFrame.x + mX + offset.x, y: sFrame.y + mY + offset.y};
  m.show();
}
