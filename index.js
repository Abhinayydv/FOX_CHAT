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

    // Broadcast join message
    io.emit('chat message', {
      username: 'System',
      msg: `${username} joined the chat`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  });

  socket.on('chat message', ({ msg, time }) => {
    io.emit('chat message', {
      username: socket.username || "Anonymous",
      msg,
      time
    });
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('chat message', {
        username: 'System',
        msg: `${socket.username} left the chat`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } else {
      console.log("A user disconnected");
    }
  });
});

http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
