var jslintLinter = require('jslint-linter');

module.exports = Object.create(jslintLinter, {
  linter: { value: { check: require("jshint").JSHINT } }
});