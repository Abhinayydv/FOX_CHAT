const socket = io();

const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const msgInput = document.getElementById('msg-input');

let myUsername = prompt("Enter your name:");
socket.emit('new-user', myUsername);

// Append message bubble
function appendMessage(content, sender = 'user', username = '', time = '') {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender);

  // Username (only for 'other')
  if (sender === 'other' && username) {
    const nameDiv = document.createElement('div');
    nameDiv.classList.add('username');
    nameDiv.innerText = username;
    messageDiv.appendChild(nameDiv);
  }

  // Message bubble
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('bubble');
  contentDiv.innerText = content;
  messageDiv.appendChild(contentDiv);

  // Timestamp
  if (time) {
    const timeDiv = document.createElement('div');
    timeDiv.classList.add('timestamp');
    timeDiv.innerText = time;
    messageDiv.appendChild(timeDiv);
  }

  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Handle form submission
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = msgInput.value.trim();
  if (!msg) return;

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Append own message
  appendMessage(msg, 'user', myUsername, time);

  // Emit to server
  socket.emit('chat message', { msg, time });

  msgInput.value = '';
});

// Listen for messages from server
socket.on('chat message', ({ username, msg, time }) => {
  if (username !== myUsername) {
    appendMessage(msg, 'other', username, time);
  }
});
