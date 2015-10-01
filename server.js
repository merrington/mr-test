var http = require('http');
var dispatcher = require('httpdispatcher');
var moment = require('moment');
var _ = require('underscore');

var PORT = 8080;

var supShifts = [
	{"start": [0,0,0], "stop": [5, 59, 59], "name": "Supervisor 1"},
	{"start": [6,0,0], "stop": [11, 59, 59], "name": "Supervisor 2"},
	{"start": [12,0,0], "stop": [17, 59, 59], "name": "Supervisor 3"},
	{"start": [18,0,0], "stop": [23, 59, 59], "name": "Supervisor 4"}
]
var notificationQueue = [];

function handleRequest(req, res) {
	try {
		dispatcher.dispatch(req, res);
	} catch (err) {
		console.error(err);
	}
}

//Check to see what supervisor needs to be notified
function notifySupervisor(cb) {
	cb(_.find(supShifts, function(shift) {
		var start = moment().hour(shift.start[0]).minute(shift.start[1]).second(shift.start[2]);
		var stop = moment().hour(shift.stop[0]).minute(shift.stop[1]).second(shift.stop[2]);
		if (moment().isBetween(start, stop)) {
			return shift;
		}
	}));
}

//setup a route for POST requests to /vault will notify supervisor
dispatcher.onPost("/vault", function(req, res) {
	var accessTime = moment().utcOffset(0).format();
	console.log("Vault accessed - %s",accessTime );
	notifySupervisor(function(shift) {
		if (shift) {
			console.log('Need to notify %s', shift.name);
			notificationQueue.push({'name': shift.name, 'accessTime': accessTime});
		} else {
			console.error('No supervisor found!');
			res.writeHead(400, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
			res.end(JSON.stringify({'ok':false}));
		}
	});
	res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
	res.end(JSON.stringify({'ok':true}));
});


//setup a route for GET requests to /vault - just list (in order) the notifications
dispatcher.onGet("/vault", function(req, res) {
	console.log("Following notifications are in the queue:");
	var notifications = [];
	_.each(notificationQueue, function(notification) {
		notifications.push(notification);
		console.log("Notifying %s for vault access at %s", notification.name, notification.accessTime);
	});
	res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
	res.end(JSON.stringify(notifications));
});


//Start the server
var server = http.createServer(handleRequest);
server.listen(PORT, function() {
	console.log("Listening on port %s", PORT);
});