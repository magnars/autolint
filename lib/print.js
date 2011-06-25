var sys = require('sys');
var _ = require('underscore');
var ansi = require('ansi');

function putStringWithSys(text) {
  sys.puts(text);
}

function print(args, colorFunc) {
  _.flatten(args).map(colorFunc.bind(ansi)).forEach(putStringWithSys);
}

function nop(str) {
  return str;
}

function black() {
  print(arguments, nop);
}

function red() {
  print(arguments, ansi.RED);
}

function green() {
  print(arguments, ansi.GREEN);
}

exports.black = black;
exports.red = red;
exports.green = green;
