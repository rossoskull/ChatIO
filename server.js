var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var users = [];

server.listen(process.env.PORT || 3000);

app.get('/', function (req, res, next) {
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {

	// New User
	socket.on('new user', function(data, callback) {
		if ( users.indexOf(data) != -1 ) {
			callback(false);
		} else {
			callback(true);
			socket.username = data;
			users.push(socket.username);
			updateUsernames();
		}
	});

	// Update usernames
	function updateUsernames() {
		io.sockets.emit('update users', users);
	}

	// Send Message
	socket.on('send message', function(data) {
		io.sockets.emit('new message', { 'msg' : data, 'user': socket.username });
	});

	socket.on('disconnect', function(data) {
		if ( !socket.username ) return;
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames(); 
	});


});