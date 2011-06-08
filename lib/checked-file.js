var pluralize = require('pluralize');

function validateParams(name, errors) {
  if (typeof name !== 'string') { 
    throw new Error('fileName is required'); 
  }
  if (!Array.isArray(errors)) { 
    throw new Error('errors array is required (can be empty though)'); 
  }
}

function create(name, errors) {
  validateParams(name, errors);
  var self = Object.create(this);
  self.name = name;
  self.errors = errors;
  return self;
}

function tooManyErrors() {
  return this.errors[this.errors.length - 1] === null;
}

function errorDescription() {
  var more = this.tooManyErrors() ? 'more than ' : '';
  return more + pluralize(this.errors.length, 'error');
}

module.exports = {
  create: create,
  tooManyErrors: tooManyErrors,
  errorDescription: errorDescription
};