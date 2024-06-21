function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');

    // Append user's message to the chat box
    const userMessage = document.createElement('div');
    userMessage.textContent = userInput.value;
    userMessage.className = 'user-message';
    chatBox.appendChild(userMessage);

    // Get user message
    const message = userInput.value;

    // Clear the input field
    userInput.value = '';

    // Send message to the backend
    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
    })
    .then(response => response.json())
    .then(data => {
        // Append assistant's response to the chat box
        const assistantMessage = document.createElement('div');
        assistantMessage.textContent = data.message;
        assistantMessage.className = 'assistant-message';
        chatBox.appendChild(assistantMessage);

        // Scroll to the bottom of the chat box
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
