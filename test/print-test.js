var buster = require('buster');
var util = require('util');
var ansi = require('../lib/ansi');

var print = require('../lib/print');

buster.testCase("print", {
  setUp: function () {
    this.stub(util, 'puts');
  },

  "should be a object": function () {
    assert.isObject(print);
  },

  "should print using util.puts": function () {
    print.black('hello');
    assert.called(util.puts);
    assert.calledWith(util.puts, 'hello');
  },

  "should print multiple lines": function () {
    print.black('hello', 'world');
    assert.calledTwice(util.puts);
    assert.calledWith(util.puts, 'hello');
    assert.calledWith(util.puts, 'world');
  },

  "should print array of lines": function () {
    print.black(["hey", "ho", "let's go"]);
    assert.calledThrice(util.puts);
    assert.calledWith(util.puts, "hey");
    assert.calledWith(util.puts, "ho");
    assert.calledWith(util.puts, "let's go");
  },

  "should print in red": function () {
    print.red('hello');
    assert.called(util.puts);
    assert.calledWith(util.puts, 'RED: hello');
  },

  "should print in green": function () {
    print.green('hey', 'dude');
    assert.calledTwice(util.puts);
    assert.calledWith(util.puts, 'GREEN: hey');
    assert.calledWith(util.puts, 'GREEN: dude');
  }
});

ansi.RED = function (text) {
  return "RED: " + text;
};

ansi.GREEN = function (text) {
  return "GREEN: " + text;
};
