Autolint
========
Autolint watches your files for jslint-errors.

Installation
------------
Right now, installation is rather clunky.

Start by installing node.js (`brew install node`), then:

    git clone https://github.com/magnars/autolint.git
    cd autolint/
    chmod a+x bin/autolint
    git submodule init && git submodule update
    cd node_modules/buster && git submodule init && git submodule update
    cd ../glob/ && make
    
And for ease of use:

    ln -s [full path to autolint/bin/autolint] ~/bin/autolint
    
or someplace on your path.

Growl
-----
If you want autolint to notify you when new lint errors are introduced
through Growl, you can get that here:

    http://growl.info/
    
Make sure you also install the `growlnotify` in the `Extras`-folder.

Basic usage
-----------
Start with: autolint [path to js-files]

    autolint src/*.js test/*.js


Configuration
-------------
Look at the default configuration `lib/default-configuration.js`
then override specific items in a file `autolint.json` at your root
with valid JSON.

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

