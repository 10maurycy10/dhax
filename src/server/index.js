const msgpack = require('msgpack-lite')
const uuid = require('uuid')
const WebSocket = require('ws');
const express = require('express');
const path = require('path');
const config = require('../shared/config.js');

fakeheaders = {
    // is pretending to be linux a good idea?
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0',
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.5',
    'accept-encoding': 'gzip, deflate',
    'sec-websocket-version': '13',
    origin: config.GAMEADDRESS,
    'sec-websocket-extensions': 'permessage-deflate',
    'connection': 'keep-alive, Upgrade',
    'sec-fetch-dest': 'websocket',
    'sec-fetch-mode': 'websocket',
    'sec-fetch-site': 'same-origin',
    'pragma': 'no-cache',
    'cache-control': 'no-cache',
    'upgrade': 'websocket'
}

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
    app.get('/mod/:fileName', (request, result) => {
		result.sendFile(path.join(__dirname, String('../mod/' + request.params.fileName)));
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
    //let con_to_real_server = WebSocket.client.connect(config.ADDRESS,config.GAMEADDRESS,fakeheaders)
    let conheaders = Object.create(fakeheaders);
    if (config.IPLIMITBYPASS)
        conheaders['x-forwarded-for'] = uuid.v4();
	console.log(conheaders)
	let con_to_real_server = new WebSocket(config.ADDRESS,["ws","wss"],{headers: conheaders});
    let con_to_real_server_open = false;
    // buffer to store packets sent beffore server connects
    let buffer = [];
    
    socket.on('message', (data) => {
        if (con_to_real_server_open) {
            con_to_real_server.send(data)
        } else {
            buffer.push(data)
        }
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
    con_to_real_server.on('open', (data) => {
        con_to_real_server_open = true;
        for (msg of buffer) {
            con_to_real_server.send(msg);
        }
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
