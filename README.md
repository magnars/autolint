Autolint
========
Autolint watches your files for jslint-errors.

Installation
------------
Start by installing node.js (`brew install node`), then:

    git clone https://github.com/magnars/autolint.git
    cd autolint/
    chmod a+x bin/autolint
    git submodule init
    git submodule update
    cd node_modules/buster
    git submodule init
    git submodule update
    
or someplace on your path.

Basic usage
-----------
Start with: autolint [path to js-files]

    autolint **/*.js
    autolint src/*.js test/*.js


Configuration
-------------
