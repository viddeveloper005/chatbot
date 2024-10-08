document.addEventListener('DOMContentLoaded', function() {
    // Ensure that the chat popup opens when the mic icon is clicked
    const micIcon = document.getElementById('mic-icon');
    if (micIcon) {
        micIcon.addEventListener('click', function() {
            document.getElementById('chat-window').style.display = 'block';
        });
    }

    // Close the chat popup when the close button is clicked
    const closeButton = document.getElementById('close-btn');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            document.getElementById('chat-window').style.display = 'none';
        });
    }

    // Event listener for sending the message when the "Send" button is clicked
    const sendButton = document.querySelector('.mic-icon'); // Changed to match the button class in HTML
    if (sendButton) {
        sendButton.addEventListener('click', function() {
            sendMessage();
        });
    }

    // Event listener to send the message when the user presses the "Enter" key
    const userInput = document.getElementById('user-input');
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

// Function to handle sending messages from the text field
function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();
    if (userInput === '') return; // Check if the input is empty and return if true

    // Display the user's message in the chat window
    displayMessage(userInput, 'user');

    // Clear the input field after sending the message
    document.getElementById('user-input').value = '';

    // Fetch and display the bot's response using the API
    fetchBotResponse(userInput);
}

// Function to handle sending predefined prompts from button clicks
function sendMessageFromPrompt(prompt) {
    displayMessage(prompt, 'user');
    fetchBotResponse(prompt);
}

// Function to fetch the bot's response from the API and handle errors
function fetchBotResponse(userMessage) {
    fetch('http://localhost:3000/chat', { // Replace with your API endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        })
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            const botReply = data.reply || 'Sorry, I could not understand that.';
            console.log(botReply);
            // Display the bot's response in the chat window
            displayMessage(botReply, 'bot');
        })
        .catch(error => {
            console.error('Error:', error);
            displayMessage('Something went wrong. Please try again later.', 'bot');
        });
}

// Function to display messages (both user and bot) in the chat window
function displayMessage(message, sender) {
    const chatWindow = document.getElementById('chat-window');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content');
    contentDiv.innerHTML = message;

    messageDiv.appendChild(contentDiv);
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}