var glob = require('glob');
var conciseReporter = require('concise-reporter');
var summaryReporter = require('summary-reporter');
var buster = require('buster');

function show(linter, filePaths) {
  var overview = this.create(linter);
  var promises = filePaths.map(function (path) {
    return overview.add(path);
  });
  buster.promise.all(promises).then(function () {
    overview.print();
  });
}

function create(linter) {
  if (!linter) {
    throw new Error('linter is required');
  }
  var self = Object.create(this);
  self.files = [];
  self.linter = linter;
  self.conciseReporter = Object.create(conciseReporter);
  self.summaryReporter = Object.create(summaryReporter);
  
  self.conciseReporter.listenTo(linter);
  self.summaryReporter.listenTo(linter);
  return self;
}

function checkFile(file) {
  this.linter.checkFile(file);
}

function add(path) {
  var self = this;
  var promise = buster.promise.create();
  glob.glob(path, function (err, files) {
    self.files = self.files.concat(files);
    promise.resolve();
  });
  return promise;
}

var numChecked = 0;
function maybeAllChecked() {
  numChecked++;
  if (numChecked === this.files.length) {
    this.allChecked();
  }
}

function print() {
  this.linter.on('clean', maybeAllChecked.bind(this));
  this.linter.on('dirty', maybeAllChecked.bind(this));
  this.files.forEach(checkFile.bind(this));
}

function allChecked() {
  this.summaryReporter.print();
}

module.exports = {
  show: show,
  create: create,
  add: add,
  print: print,
  checkFile: checkFile,
  allChecked: allChecked
};