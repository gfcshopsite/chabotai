const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const imageUpload = document.getElementById('image-upload');

let database = {};

// Carica il database JSON
fetch('database.json')
    .then(response => response.json())
    .then(data => {
        database = data;
        console.log('Database caricato con successo');
    })
    .catch(error => console.error('Errore nel caricamento del database:', error));

function addMessage(message, isUser = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function getBotResponse(message) {
    const lowercaseMessage = message.toLowerCase();
    return database[lowercaseMessage] || database["default"];
}

sendButton.addEventListener('click', () => {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            addMessage(botResponse);
        }, 500);
    }
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.classList.add('uploaded-image');
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'user-message');
            messageElement.appendChild(img);
            chatContainer.appendChild(messageElement);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        };
        reader.readAsDataURL(file);
    }
});