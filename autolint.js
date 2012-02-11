module.exports = {
  "paths": [
    "test/*.js",
    "lib/*.js"
  ],
  "linterOptions": {
    "node": true,
    "indent": 2,
    "maxlen": 120,
    "vars": true,
    "nomen": true,
    "sloppy": true,
    "predef": [
      "assert",
      "refute"
    ]
  },
  "excludes": [
    "ansi.js"
  ]
};
