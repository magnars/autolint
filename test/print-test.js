var buster = require('buster');
var assert = buster.assert;
var sys = require('sys');
var ansi = require('../lib/ansi');

var print = require('../lib/print');

buster.testCase("print", {
  setUp: function () {
    this.stub(sys, 'puts');
  },
  
  "should be a object": function () {
    assert.isObject(print);
  },
  
  "should print using sys.puts": function () {
    print.black('hello');
    assert.called(sys.puts);
    assert.calledWith(sys.puts, 'hello');
  },
  
  "should print multiple lines": function () {
    print.black('hello', 'world');
    assert.calledTwice(sys.puts);
    assert.calledWith(sys.puts, 'hello');
    assert.calledWith(sys.puts, 'world');
  },
  
  "should print array of lines": function () {
    print.black(["hey", "ho", "let's go"]);
    assert.calledThrice(sys.puts);
    assert.calledWith(sys.puts, "hey");
    assert.calledWith(sys.puts, "ho");
    assert.calledWith(sys.puts, "let's go");
  },
  
  "should print in red": function () {
    print.red('hello');
    assert.called(sys.puts);
    assert.calledWith(sys.puts, 'RED: hello');
  },
  
  "should print in green": function () {
    print.green('hey', 'dude');
    assert.calledTwice(sys.puts);
    assert.calledWith(sys.puts, 'GREEN: hey');
    assert.calledWith(sys.puts, 'GREEN: dude');
  }
});

ansi.RED = function (text) {
  return "RED: " + text;
};

ansi.GREEN = function (text) {
  return "GREEN: " + text;
};
