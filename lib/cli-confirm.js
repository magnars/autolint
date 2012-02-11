function prompt(q, callback) {
  var rl = require("readline");
  var i = rl.createInterface(process.stdin, process.stdout, null);
  i.question(q, function (a) {
    i.close();
    process.stdin.destroy();
    callback(a);
  });
}

function confirmation(answer) {
  return answer.trim().substring(0, 1).toLowerCase() === "y";
}

module.exports = function (q, callback) {
  prompt(q + " [y/N]: ", function (a) {
    if (confirmation(a)) {
      callback();
    }
  });
};