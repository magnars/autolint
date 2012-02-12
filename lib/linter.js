module.exports = {
  create: function (conf) {
    return require('./' + conf.linter + '-linter').create(conf.linterOptions);
  }
};