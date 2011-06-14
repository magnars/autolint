/*jslint indent: 2, onevar: false */
/*global require */

var buster = require('buster');
var assert = buster.assert;
var fs = require('fs');
var path = require('path');
var defaultConfiguration = require('default-configuration');

var loadConfiguration = require('load-configuration');

buster.testCase("loadConfiguration", {
  setUp: function () {
    defaultConfiguration.test = 'default';
    this.stub(path, 'exists');
    this.stub(fs, 'readFile');
  },
  
  "should be function": function () {
    assert.isFunction(loadConfiguration);
  },
  
  "should complain about missing cli arguments": function () {
    assert.exception(function () {
      loadConfiguration();
    });
  },
  
  "should return promise": function () {
    assert.isFunction(loadConfiguration([]).then);
  },
  
  "should check if autolint.json exists": function () {
    loadConfiguration([]);
    assert.called(path.exists);
    assert.calledWith(path.exists, 'autolint.json');
  },
  
  "when autolint.json doesn't exist": {
    setUp: function () {
      path.exists.yields(false);
    },
    
    "should not load": function () {
      loadConfiguration([]);
      assert.notCalled(fs.readFile);
    },

    "should resolve promise with default configuration": function () {
      loadConfiguration([]).then(function (config) {
        assert.equals(config.test, 'default');
      });
    }
  },
  
  "when autolint.json exists": {
    setUp: function () {
      path.exists.yields(true);
    },
    
    "should load it": function () {
      loadConfiguration([]);
      assert.called(fs.readFile);
      assert.calledWith(fs.readFile, 'autolint.json', 'utf-8');
    },
    
    "should overwrite default configuration": function () {
      fs.readFile.yields(null, '{"test":"config"}');
      loadConfiguration([]).then(function (config) {
        assert.equals(config.test, 'config');
      });
    },
    
    "should not overwrite all options": function () {
      defaultConfiguration.options = {bitwise: "test"};
      fs.readFile.yields(null, '{"options":{"node":true}}');
      loadConfiguration([]).then(function (config) {
        assert.isTrue(config.options.node, 'config.options.node');
        assert.equals(config.options.bitwise, "test");
      });
    },
    
    "should overwrite config file paths with args": function () {
      fs.readFile.yields(null, '{"paths":["file"]}');
      loadConfiguration(['arg']).then(function (config) {
        assert.equals(config.paths, ['arg']);
      });
    }
  }
});
