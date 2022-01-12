const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});
const fs = require("fs");

app.use(express.static('./Public'));

const connections = [null, null];

app.get('/', function(req, res){
    res.sendFile(`${__dirname}/Public/index.html`);
})

app.get('/getText', function(req, res){
    let tab = fs.readdirSync(__dirname + "/Texte");
    res.send({'text' : fs.readFileSync(__dirname + "/Texte/" + tab[Math.floor(Math.random()*tab.length)], "utf8")});
})

io.on("connection", function(socket){

    let playerIndex = -1;
    for (const i in connections) {
        if (connections[i] === null) {
            playerIndex = i;
            break;
        }
    }

    socket.emit('player-number', playerIndex);

    if(playerIndex!=-1){
        console.log(`Player ${playerIndex} has connected`);
    }else{
        console.log(`spect has connected`);
    }
  // Ignore player 3
    if (playerIndex === -1) return;
    connections[playerIndex] = false;

  // Tell eveyone what player number just connected
    socket.broadcast.emit('player-connection', playerIndex);

    socket.on('disconnect', () => {
        console.log(`Player ${playerIndex} disconnected`);
        connections[playerIndex] = null;
        //Tell everyone what player numbe just disconnected
        socket.broadcast.emit('player-connection', playerIndex);
    })

    socket.on('writing', (data) => {
        socket.broadcast.emit('printf-writing', data);
        data.taille = data.writing.length;
        socket.emit('printf-writing', data);
    })
      // On Ready
    // socket.on('player-ready', () => {
    //     socket.broadcast.emit('enemy-ready', playerIndex);
    //     connections[playerIndex] = true;
    // })

    // socket.on('check-players', () => {
    //     const players = [];
    //     for (const i in connections) {
    //         connections[i] === null ? players.push({connected: false, ready: false}) : players.push({connected: true, ready: connections[i]});
    //     }
    //     socket.emit('check-players', players);
    // })

      // Timeout connection
    setTimeout(() => {
        connections[playerIndex] = null;
        socket.emit('timeout');
        socket.disconnect();
    }, 600000) // 10 minute limit per player
})


httpServer.listen(3000);