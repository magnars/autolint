module.exports = function (message, callback) {
  var interrupted = false;
  process.on('SIGINT', function () {
    if (interrupted) {
      process.exit();
    }
    console.log(message + " Interrupt a second time to quit");
    interrupted = true;
    setTimeout(function () {
      interrupted = false;
      callback();
    }, 1500);
  });
};
