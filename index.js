const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);

const PORT = process.env.PORT || 3000;

// Serve static files from "public" folder
app.use(express.static('public'));

// Default route
app.get("/", (req, res) => {
  res.send("Server is working!");
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('new-user', (username) => {
    socket.username = username;
    socket.broadcast.emit('chat message', `${username} joined the chat`);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', `${socket.username || "Anonymous"}: ${msg}`);
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('chat message', `${socket.username} left the chat`);
    } else {
      console.log("A user disconnected");
    }
  });
});

http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
