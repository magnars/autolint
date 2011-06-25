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
  return Object.create(this, {
    name: { value: name },
    errors: { value: errors }
  });
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
