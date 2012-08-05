module.exports = function (message, callback) {
  var interrupted = false
	,platform = process.platform
	,signal = (platform.indexOf('win') !== -1)?"exit":"SIGINT";
  //exit signal when platform is exit, otherwise SIGINT signal
  process.on(signal, function () {
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
