const socket = io();
const form = document.getElementById('msgForm');
const input = document.getElementById('m');
const messages = document.getElementById('messages');

// Ask username on connect
let username = prompt("Enter your name:");
socket.emit('new-user', username);

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

socket.on('chat message', function(msg) {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});
