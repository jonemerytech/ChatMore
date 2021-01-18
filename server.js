const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'ChatMore Bot';

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatMore'));

    // Broadcast when a use connects
    socket.broadcast.emit(
      'message',
      formatMessage(botName, 'A user has joined the chat')
    );
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    io.emit('message', formatMessage('USER', msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', formatMessage(botName, 'A user has left the chat'));
  });
});

const PORT = 3000 || proccess.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
