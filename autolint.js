module.exports = {
  "paths": [
    "test/*.js",
    "lib/*.js"
  ],
  "linterOptions": {
    "node": true,
    "indent": 2,
    "onevar": false,
    "nomen": false,
    "maxlen": 120,
    "predef": [
      "assert",
      "refute"
    ]
  },
  "excludes": [
    "ansi.js"
  ]
};
