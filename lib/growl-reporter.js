var growl = require('growl');
var pluralize = require('pluralize');

function create(repository) {
  if (!repository) {
    throw new Error('repository is required');
  }
  return Object.create(this, {
    repository: { value: repository }
  });
}

function listen() {
  this.repository.on('errorsIntroduced', this.handleErrorsIntroduced.bind(this));
  this.repository.on('errorsFixed', this.handleErrorsFixed.bind(this));
}

function handleErrorsIntroduced(file, errors) {
  var error = 'First error at line ' + errors[0].line + 
              ' char ' + errors[0].character + 
              ':\n' + errors[0].reason;
  var title = 'You introduced ' + pluralize(errors.length, 'lint error') + ' in ' + file.name + ':';
  growl.notify(error, {
    title: title,
    image: __dirname + '/../icons/no.png'
  });
}

var cheers = [
  "You're the new Cleanup Gold Champion!",
  'Awesome!',
  'Rock on!',
  'Brilliant!',
  'Most excellent!',
  'Wonderful!',
  'Kick ass!',
  'Sparkling clean!',
  'Pro linting!',
  'Smashing work!',
  'You rock!',
  'Lint ... terminated.',
  'Sweet!',
  'Good job!'
];

var lastCheerIndex;

function cheer() {
  if (!lastCheerIndex || lastCheerIndex === 0) {
    lastCheerIndex = cheers.length;
  }
  lastCheerIndex -= 1;
  return cheers[lastCheerIndex];
}

function congratulate(file) {
  growl.notify(file.name + ' is clean.', {
    title: cheer(),
    image: __dirname + '/../icons/ok.png'
  });
}

function nextError(file) {
  var errors = file.errors;
  var error = 'Next error at line ' + errors[0].line + 
              ' char ' + errors[0].character + 
              ':\n' + errors[0].reason;
  var title = 'Nice cleanup!';
  growl.notify(error, {
    title: title,
    image: __dirname + '/../icons/more.png'
  });
}

function handleErrorsFixed(file, fixedError) {
  if (file.errors.length === 0) {
    congratulate(file);
  } else {
    nextError(file);
  }
}

exports.create = create;
exports.listen = listen;
exports.handleErrorsIntroduced = handleErrorsIntroduced;
exports.handleErrorsFixed = handleErrorsFixed;