Changes from 0.1.5 to 1.0.0
---------------------------

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
