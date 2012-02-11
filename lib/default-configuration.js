module.exports = {
  paths: ["**/*.js"],
  linter: "jslint",
  linterOptions: {
    "indent": 4,         // the indentation factor
    "maxlen": 80,        // the maximum length of a source line
    "maxerr": 50,        // the maximum number of errors to report per file
    "anon": false,       // true, if the space may be omitted in anonymous function declarations
    "bitwise": false,    // true, if bitwise operators should be allowed
    "browser": false,    // true, if the standard browser globals should be predefined
    "cap": false,        // true, if upper case HTML should be allowed
    "continue": false,   // true, if the continuation statement should be tolerated
    "css": false,        // true, if CSS workarounds should be tolerated
    "debug": false,      // true, if debugger statements should be allowed
    "devel": false,      // true, if logging should be allowed (console, alert, etc.)
    "eqeq": false,       // true, if == should be allowed
    "es5": false,        // true, if ES5 syntax should be allowed
    "evil": false,       // true, if eval should be allowed
    "forin": false,      // true, if for in statements need not filter
    "fragment": false,   // true, if HTML fragments should be allowed
    "newcap": false,     // true, if constructor names capitalization is ignored
    "node": false,       // true, if Node.js globals should be predefined
    "nomen": false,      // true, if names may have dangling _
    "on": false,         // true, if HTML event handlers should be allowed
    "passfail": false,   // true, if the scan should stop on first error
    "plusplus": false,   // true, if increment/decrement should be allowed
    "properties": false, // true, if all property names must be declared with /*properties*/
    "regexp": false,     // true, if the . should be allowed in regexp literals
    "rhino": false,      // true, if the Rhino environment globals should be predefined
    "undef": false,      // true, if variables can be declared out of order
    "unparam": false,    // true, if unused parameters should be tolerated
    "sloppy": false,     // true, if the 'use strict'; pragma is optional
    "sub": false,        // true, if all forms of subscript notation are tolerated
    "vars": false,       // true, if multiple var statements per function should be allowed
    "white": false,      // true, if sloppy whitespace is tolerated
    "widget": false,     // true  if the Yahoo Widgets globals should be predefined
    "windows": false     // true, if MS Windows-specific globals should be predefined
  }
};
