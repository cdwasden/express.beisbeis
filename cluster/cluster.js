var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
	console.log("numCPUs " + numCPUs);
	// OK, let's ignore the actual CPUs, so we can see the concurrency
	numCPUs = 4;

	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('exit', function(worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
	});

} else {
	console.log("Worker " + process.pid);
	//Change this line to Your Node.js app entry point
	require("./bin/www");
}
