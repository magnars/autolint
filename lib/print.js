var util = require('util');
var _ = require('underscore');
var ansi = require('./ansi');

function putStringWithUtil(text) {
  util.puts(text);
}

function print(args, colorFunc) {
  _.flatten(args).map(colorFunc.bind(ansi)).forEach(putStringWithUtil);
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
