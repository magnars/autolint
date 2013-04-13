# Autolint

Autolint watches your files for jslint-errors. DRY up your js-files, freeing
them of all those linting config comments. Gather all your linting preferences
in one place per project.

## Installation

Make sure you've got [node.js](http://nodejs.org/) and [npm](http://npmjs.org/), then:

    npm install autolint -g

## Basic usage

Create a default configuration file by running:

    autolint

Tweak the config to your liking, then start linting with:

    autolint

Once running, you can see all errors in all files by pressing ctrl-c in
the terminal window. To see errors in a single file, update its mtime by
saving or touching it.

You can also skip the watching-part, and just lint the entire project once:

    autolint --once

It terminates with a non-zero exit code if any lint is found, making it
well suited for pre-commit hooks if you are so inclined.

If you're confused by the linting error messages, check out [jslinterrors.com](http://jslinterrors.com/).

## Configuration

Look at the default configuration
[`lib/default-configuration.js`](autolint/blob/master/lib/default-configuration.js)
then override specific items in `autolint.js`. `autolint` always looks for this
file in the current directory.

Example:

    module.exports = {
      paths: [
        "lib/**/*.js",
        "test/**/*.js"
      ],
      linterOptions: {
        node: true
      }
    };

### Excluding files

You can also tell autolint to skip linting some files, like so:

    module.exports = {
      excludes: [
        "jquery",
        "underscore",
        "sinon",
        "raphael"
      ]
    };

Any files (or paths) containing those words will not be linted, or counted
towards your error total.

## Growl

If you want autolint to notify you when new lint errors are introduced,
you can [download Growl here](http://growl.info/).

## Using JSHint

If JSLint is hurting your feelings, you can easily switch to
[JSHint](http://jshint.com) by adding this to your configuration:

    module.exports = {
      "linter": "jshint"
    };

## Linter options

The defaults are very strict, so tweak them to your liking.

For jslint:

    module.exports = {
      linterOptions: {
        indent      : 4,     // the indentation factor
        maxlen      : 80,    // the maximum length of a source line
        maxerr      : 50,    // the maximum number of errors to report per file
        anon        : false, // true, if the space may be omitted in anonymous function declarations
        bitwise     : false, // true, if bitwise operators should be allowed
        browser     : false, // true, if the standard browser globals should be predefined
        cap         : false, // true, if upper case HTML should be allowed
        "continue"  : false, // true, if the continuation statement should be tolerated
        css         : false, // true, if CSS workarounds should be tolerated
        debug       : false, // true, if debugger statements should be allowed
        devel       : false, // true, if logging should be allowed (console, alert, etc.)
        eqeq        : false, // true, if == should be allowed
        es5         : false, // true, if ES5 syntax should be allowed
        evil        : false, // true, if eval should be allowed
        forin       : false, // true, if for in statements need not filter
        fragment    : false, // true, if HTML fragments should be allowed
        newcap      : false, // true, if constructor names capitalization is ignored
        node        : false, // true, if Node.js globals should be predefined
        nomen       : false, // true, if names may have dangling _
        on          : false, // true, if HTML event handlers should be allowed
        passfail    : false, // true, if the scan should stop on first error
        plusplus    : false, // true, if increment/decrement should be allowed
        properties  : false, // true, if all property names must be declared with /*properties*/
        regexp      : false, // true, if the . should be allowed in regexp literals
        rhino       : false, // true, if the Rhino environment globals should be predefined
        undef       : false, // true, if variables can be declared out of order
        unparam     : false, // true, if unused parameters should be tolerated
        sloppy      : false, // true, if the 'use strict'; pragma is optional
        sub         : false, // true, if all forms of subscript notation are tolerated
        vars        : false, // true, if multiple var statements per function should be allowed
        white       : false, // true, if sloppy whitespace is tolerated
        widget      : false, // true  if the Yahoo Widgets globals should be predefined
        windows     : false  // true, if MS Windows-specific globals should be predefined
      }
    };

For jshint:

    module.exports = {
      linterOptions: {
        asi         : true,  // true, if automatic semicolon insertion should be tolerated
        bitwise     : true,  // true, if bitwise operators should not be allowed
        boss        : true,  // true, if advanced usage of assignments should be allowed
        browser     : true,  // true, if the standard browser globals should be predefined
        couch       : true,  // true, if CouchDB globals should be predefined
        curly       : true,  // true, if curly braces around all blocks should be required
        debug       : true,  // true, if debugger statements should be allowed
        devel       : true,  // true, if logging globals should be predefined (console, alert, etc.)
        dojo        : true,  // true, if Dojo Toolkit globals should be predefined
        eqeqeq      : true,  // true, if === should be required
        eqnull      : true,  // true, if == null comparisons should be tolerated
        es5         : true,  // true, if ES5 syntax should be allowed
        esnext      : true,  // true, if es.next specific syntax should be allowed
        evil        : true,  // true, if eval should be allowed
        expr        : true,  // true, if ExpressionStatement should be allowed as Programs
        forin       : true,  // true, if for in statements must filter
        funcscope   : true,  // true, if only function scope should be used for scope tests
        globalstrict: true,  // true, if global "use strict"; should be allowed (also enables 'strict')
        immed       : true,  // true, if immediate invocations must be wrapped in parens
        iterator    : true,  // true, if the `__iterator__` property should be allowed
        jquery      : true,  // true, if jQuery globals should be predefined
        lastsemic   : true,  // true, if semicolons may be ommitted for the trailing statements inside of a one-line blocks.
        latedef     : true,  // true, if the use before definition should not be tolerated
        laxbreak    : true,  // true, if line breaks should not be checked
        laxcomma    : true,  // true, if line breaks should not be checked around commas
        loopfunc    : true,  // true, if functions should be allowed to be defined within loops
        mootools    : true,  // true, if MooTools globals should be predefined
        multistr    : true,  // true, allow multiline strings
        newcap      : true,  // true, if constructor names must be capitalized
        noarg       : true,  // true, if arguments.caller and arguments.callee should be disallowed
        node        : true,  // true, if the Node.js environment globals should be predefined
        noempty     : true,  // true, if empty blocks should be disallowed
        nonew       : true,  // true, if using `new` for side-effects should be disallowed
        nonstandard : true,  // true, if non-standard (but widely adopted) globals should be predefined
        nomen       : true,  // true, if names should be checked
        onevar      : true,  // true, if only one var statement per function should be allowed
        onecase     : true,  // true, if one case switch statements should be allowed
        passfail    : true,  // true, if the scan should stop on first error
        plusplus    : true,  // true, if increment/decrement should not be allowed
        proto       : true,  // true, if the `__proto__` property should be allowed
        prototypejs : true,  // true, if Prototype and Scriptaculous globals should be predefined
        regexdash   : true,  // true, if unescaped first/last dash (-) inside brackets should be tolerated
        regexp      : true,  // true, if the . should not be allowed in regexp literals
        rhino       : true,  // true, if the Rhino environment globals should be predefined
        undef       : true,  // true, if variables should be declared before used
        scripturl   : true,  // true, if script-targeted URLs should be tolerated
        shadow      : true,  // true, if variable shadowing should be tolerated
        smarttabs   : true,  // true, if smarttabs should be tolerated (http://www.emacswiki.org/emacs/SmartTabs)
        strict      : true,  // true, if the "use strict"; pragma is required
        sub         : true,  // true, if all forms of subscript notation are tolerated
        supernew    : true,  // true, if `new function () { ... };` and `new Object;` should be tolerated
        trailing    : true,  // true, if trailing whitespace rules apply
        validthis   : true,  // true, if 'this' inside a non-constructor function is valid.
        white       : true,  // true, if strict whitespace rules apply
        wsh         : true   // true, if the Windows Scripting Host environment globals should be predefined
      }
    };

The rules in autolint.js are project-wide, but you can still have file and function specific rules, like this:

    /*jslint bitwise:true*/

Adding it to the top of the file will allow bitwise operators in the entire file, or you can add it to a single function:

    function justHere() {
        /*jslint bitwise:true*/
        return 1 << 1;
    }

## Changes

### 1.1.3

* Better stability of file-watching.

### 1.1.0

* The configuration file can now also be called `autolint-config.js`
  to avoid issues where Windows will try to execute the `autolint.js`
  config file when running `autolint`.

* Now supports the exit signal on Windows to check all files.

### 1.0.0

Autolint now uses [semantic versioning](http://semver.org).

* The configuration file is no longer a `json`-file, but a proper node
  module. Add `module.exports =` to the start of the file and rename to
  `autolint.js` to upgrade.
* Autolint no longer runs without a config file. Running it without one will
  prompt you for a default config file to be created.
* Passing `--once` to autolint makes it not-so-auto. Instead it is run once,
  exiting with a `-1` error code if any lint is found. This makes it well
  suited for pre-commit-hooks and the like.
* Updated bundled versions of jslint and jshint - these have been significantly
  changed since last, so your configuration file will certainly need an upgrade
  too.

## Contribute

If you want to help out with features or bug fixes, that's awesome.
Check out [`todo.org`](autolint/blob/master/todo.org) for inspiration.

* Fork the project.
* Make your feature addition or bug fix.
* Don't forget tests. This is important so I don't break it in a
  future version unintentionally.
* Commit and send me a pull request.

### Setting up development environment

Check out the source code from your fork:

    git clone <url to your fork>
    cd autolint

Install [buster.js](http://busterjs.org) if you haven't already:

    npm install buster -g

Then link buster in:

    npm link buster

Fetch the dependencies with npm:

    npm install

Run the tests to make sure everything works:

    buster test

Install [watchr](https://github.com/mynyml/watchr) to run the tests automatically:

    gem install watchr

Then start the autotest with:

    watchr watch-tests.watchr

If watchr can't be interrupted with 2x ctrl-c, switch to ruby ~1.9

Also make sure you follow the linting rules with:

    autolint

of course. ^^

## License

See LICENSE file.
