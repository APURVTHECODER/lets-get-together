var express = require('express'); // imports the Express library to use its features.
var app = express();      //creates an instance of the Express application.
var http = require('http');   // imports the built-in Node.js http module to create a web server.
var server = http.createServer(app);    //creates a web server that listens for incoming HTTP requests on the app instance.
var io = require('socket.io')(server, { cors: { origin: '*' } });    // creates a new instance of Socket.IO and attaches it to the web server, which enables real-time communication between the server and connected clients. The cors object is set to allow requests from any origin.

var port = process.env.PORT || 4000;  // specifies the port that the server will listen on.

app.get('/', (req, res) => {    //creates a route for the home page and sends a simple HTML string in the response.
	res.send("<h1>Let's Get Together Server</h1>");
});

io.on('connection', (socket) => {     //listens for a 'connection' event and executes a callback function when a client connects to the server using Socket.IO.
	socket.emit('whoami', { id: socket.id });
	// join to the room
	socket.on('joinmetothisroom', ({ roomid, name }) => {
		socket.join(roomid);
		socket.emit('joinmetothisroomsuccess', `${roomid} `);  //listens for a 'joinmetothisroom' event from the client, which contains the room ID and name of the user to be joined to that room. The client is then joined to the specified room and a 'joinmetothisroomsuccess' event is sent to the client.
		io.to(roomid).emit('someonejoined', name);  // broadcasts a 'someonejoined' event to all clients in the same room, notifying them of the new user who has joined the room.
	});

	// tell everyone who are here in the room
	socket.on('tell_everyone_who_joined', ({ allusers, roomid }) => {   // listens for a 'tell_everyone_who_joined' event from the client, which contains an array of all the users who have joined the room and the room ID. The server broadcasts a 'who_joined' event to all clients in the same room, which contains the list of all the users in that room.
		io.to(roomid).emit('who_joined', allusers);
	});

	// check connection
	socket.on('msg', ({ data, roomid }) => {   //  listens for a 'msg' event from the client, which contains the message and room ID. The server broadcasts a 'msg' event to all clients in the same room, which contains the message sent by the client
		io.to(roomid).emit('msg', data);
	});

	// get video state
	socket.on('videoStates', ({ videoState, roomid }) => {   //listens for a 'videoStates' event from the client, which contains the current state of the video (e.g., playing or paused) and the room ID. The server broadcasts a 'videoStates' event to all clients in the same room, which contains the updated video state.
		io.to(roomid).emit('videoStates', videoState);
	});

	// disconnect
	socket.on('disconnect', () => {  //listens for a 'disconnect' event and executes a callback function when a client disconnects from the server.
		console.log('user disconnected');
	});
});

server.listen(port, () => {
	console.log(`listening on ${port}`);
});
