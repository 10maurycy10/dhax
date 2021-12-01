const msgpack = require('msgpack-lite')
const WebSocket = require('ws');
const express = require('express');
const path = require('path');
const config = require('../shared/config.js');

function setupServer() {
	const wss = new WebSocket.Server({
		noServer: true
	});
    
	const app = express();
	const PORT = config.PORT;
	const server = app.listen(PORT,
		() => {
            console.log(`Server started on Port ${PORT}`)
            console.log(`go to  http://localhost:${PORT}`)
        }
    );
	
    app.use(express.static('src/client'));
	app.get('/', (request, result) => {
		result.sendFile(path.join(__dirname, '../client/index.html'));
	});
	app.get('/shared/:fileName', (request, result) => {
		result.sendFile(path.join(__dirname, String('../shared/' + request.params.fileName)));
	});
	server.on('upgrade', (request, socket, head) => {
		wss.handleUpgrade(request, socket, head, (socket) => {
			wss.emit('connection', socket, request);
		});
	});
	return wss;
}

wss = setupServer()

wss.on('connection', (socket, req) => {
    console.info(`got connection from ${req.socket.remoteAddress}`)
    
	let con_to_real_server = new WebSocket(config.ADDRESS);
    
    socket.on('message', (data) => {
        con_to_real_server.send(data)
	});

	socket.on('close', () => {
        console.log(`client ${req.socket.remoteAddress} reqested connection shutdown`)
        con_to_real_server.close()
	});
    socket.on('error', function(err){
        console.warn(`Error on incoming connection from ${req.socket.remoteAddress}: `+err.message);
        socket.close()
    })
    socket.send(msgpack.encode({config: config}))
    
    con_to_real_server.on('error', function(err){
        console.warn("Error on connection to remote server: "+err.message);
        console.warn("Is the server down?")
        socket.close()
    })
    con_to_real_server.on('message', (data) => {
        if (data.v) {
            console.log(`server is reporting version: ${data.v}`)
        }
        socket.send(data)
	});
	con_to_real_server.on('close', () => {
        console.log(`remote server reqested connection shutdown`)
        socket.close()
	});
});
