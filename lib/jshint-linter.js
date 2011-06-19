var jslintLinter = require('jslint-linter');

module.exports = Object.create(jslintLinter, {
    linter: { value: require("jshint/jshint.js").JSHINT }
});