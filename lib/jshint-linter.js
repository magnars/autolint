module.exports = require('./jslint-linter');
module.exports.create = function (options) {
  if (!options) { throw new TypeError('options is required (at least an empty object)'); }
  return Object.create(this, {
    options: { value: options },
    linter: { value: { check:  require('jshint').JSHINT} }
  });
};