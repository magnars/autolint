module.exports = {
  paths: [ "./**/*.js" ],   // a list of paths to the files you want linted
  linter: "jslint",         // optionally: jshint
  linterOptions: {          // see default-configuration.js for a list of all options
    predef: []              // a list of known global variables
  },
  excludes: []              // a list of strings/regexes matching filenames that should not be linted
};
