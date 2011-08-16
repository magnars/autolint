Autolint
========
Autolint watches your files for jslint-errors.

Installation
------------
Make sure you've got [node.js](http://nodejs.org/) and [npm](http://npmjs.org/), then:

    npm install autolint -g

Basic usage
-----------
Scan all `.js`-files in this directory and sub-directories with:

    autolint

You can also specify paths:

    autolint src/*.js test/*.js

Once running, you can see all errors in all files by pressing ctrl-c in
the terminal window. To see errors in a single file, update its mtime by
saving or touching it.

Configuration
-------------
Look at the default configuration
[`lib/default-configuration.js`](autolint/blob/master/lib/default-configuration.js)
then override specific items in a file `autolint.json` with valid JSON. `autolint`
looks for this file in the current directory, so I usually place it at the root of
the project.

Example:

    {
      "paths": [
        "lib/**/*.js",
        "test/**/*.js"
      ],
      "linterOptions": {
        "node": true
      }
    }

When you specify `paths` in the config-file, you can start linting with:

    autolint
    
which is rather nice.

Excluding files
---------------
You can also tell autolint to skip linting some files, like so:

    {
      "excludes": [
        "jquery",
        "underscore",
        "sinon",
        "raphael"
      ]
    }

Any files (or paths) containing those words will not be linted, or counted towards your error total.

Growl
-----
If you want autolint to notify you when new lint errors are introduced,
you can [download Growl here](http://growl.info/).
    
Make sure you also install the `growlnotify` in the `Extras`-folder.

Using JSHint
------------
If JSLint is hurting your feelings, you can easily switch to
[JSHint](http://jshint.com) by adding this to your configuration:

    {
      "linter": "jshint"
    }

Contribute
----------
If you want to help out with features or bug fixes, that's awesome.
Check out [`todo.md`](autolint/blob/master/todo.md) for inspiration.

* Fork the project.
* Make your feature addition or bug fix.
* Don't forget tests. This is important so I don't break it in a
  future version unintentionally.
* Commit and send me a merge request.

Setting up development environment
----------------------------------
Check out the source code from your fork:

    git clone <url to your fork>

Fetch the dependencies with npm:

    npm install
    
Run the tests to make sure everything works:

    ./run_tests
    
Install [watchr](https://github.com/mynyml/watchr) to run the tests automatically:

    gem install watchr
    
Then start the autotest with:

    watchr autotest.watchr

If watchr can't be interrupted with 2x ctrl-c, switch to ruby ~1.9

Also make sure you follow the linting rules with:

    autolint
    
of course. ^^