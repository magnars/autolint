module.exports = function (message, callback) {
  var interrupted = false;
  try{
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
  }
  catch(err){
	//fallback for windows because windows doesn't know the signal SIGINT
	process.on('exit', function () {
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
  }
};
