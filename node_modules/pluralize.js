function pluralize(num, name) {
  if (num !== 1) {
    name = name + 's';
  }
  return num + " " + name;
}

module.exports = pluralize;