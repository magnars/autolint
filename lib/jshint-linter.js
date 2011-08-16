var jslintLinter = require('./jslint-linter');

module.exports = Object.create(jslintLinter, {
  linter: { value: { check: require("../vendor/jshint").JSHINT } }
});