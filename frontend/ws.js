const https = require("https");
const fs = require("fs");
const ws = require("ws");

// import { createServer } from 'https';
// import { readFileSync } from 'fs';
// import { WebSocketServer } from 'ws';

const server = https.createServer({
	cert: fs.readFileSync('/etc/ssl/localhost.pem'),
	key: fs.readFileSync('/etc/ssl/localhost-key.pem')
});
const wss = new ws.WebSocketServer({ server });

wss.on('connection', function connection(s) {
	s.on('message', function message(data) {
		console.log('received: %s', data);
	});

	s.send('something');
});

server.listen(8080);
console.log("listening on 8080");