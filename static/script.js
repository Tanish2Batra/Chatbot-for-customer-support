document.addEventListener('DOMContentLoaded', function() {

  const chatbotEmojis = ["😄", "😂", "👍", "😉", "🎉", "❤️", "🚀", "👀", "🤖", "💬"];
  const chatBox = document.getElementById('chat-box');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const genericNotFoundResponses = [
    "Hmm, I'm not quite sure how to answer that. Could you ask in a different way?",
    "I'm still learning and don't have an answer to that question yet. 🤖",
    "Looks like I need to read more books; I don't know the answer to that. 📚",
    "That's a good question, and honestly, I'm not sure about the answer. 🤔",
    "I'm scratching my circuits over here, but I can't seem to find an answer. 💾",
    "Oops, that one went over my head. Can we try a different question? 🚀"
];

  function getRandomEmoji() {
    const randomIndex = Math.floor(Math.random() * chatbotEmojis.length);
    return chatbotEmojis[randomIndex];
  }
  
    // Function to find the answer for the user's question
const findAnswer = async (userQuestion) => {
  try {
      // Sending a POST request to Flask server
      const response = await fetch('/ask', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({message: userQuestion})
      });

      const data = await response.json();  // Parse the JSON response from Flask

      // Display the answer from Flask
      return data.answer;
  } catch (error) {
      console.error('Error fetching data:', error);
      // Here you could also return a generic error response or handle the error as you see fit
      return "I'm sorry, there was an error processing your request.";
  }
};

  
  
    // Function to display the user's message in the chat box
    const displayUserMessage = (message) => {
      const chatBox = document.getElementById('chat-box');
      const messageElement = document.createElement('div');
      const messageElement2 = document.createElement('div');
      const iconElement = document.createElement('img');
      iconElement.src = '/static/images/man.png'; // Path to user icon image
      iconElement.alt = 'User';
      iconElement.className = 'message-icon'; // Class for the icon
      messageElement.appendChild(iconElement);
      messageElement.appendChild(document.createTextNode(message));
      messageElement.className = 'message user-message'; // Apply the user message class
      messageElement2.className = 'clear-div'; // Apply the user message class
      chatBox.appendChild(messageElement);
      chatBox.appendChild(messageElement2);
      chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
  };
  
  // Function to display the chatbot's message in the chat box
  const displayChatbotMessage = (message) => {
      const chatBox = document.getElementById('chat-box');
      const messageElement = document.createElement('div');
      const iconElement = document.createElement('img');
      iconElement.src = '/static/images/chatbot.png'; // Path to chatbot icon image
      iconElement.alt = 'Chatbot';
      iconElement.className = 'message-icon'; // Class for the icon
      messageElement.appendChild(iconElement);
      messageElement.appendChild(document.createTextNode(message));
      messageElement.className = 'message chatbot-message'; // Apply the chatbot message class
      chatBox.appendChild(messageElement);
      chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
  };
  
  function showTypingIndicator() {
    const chatBox = document.getElementById('chat-box');
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'typing-dot';
      typingIndicator.appendChild(dot);
    }
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typingIndicator; // Return the indicator element for later use
  }

  function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    const iconElement = document.createElement('img');
    iconElement.src = sender === 'user' ? '/static/images/man.png' : '/static/images/chatbot.png';
    iconElement.alt = sender;
    iconElement.className = 'message-icon';
    
    messageElement.appendChild(iconElement);
    messageElement.appendChild(document.createTextNode(message));
    messageElement.className = `message ${sender}-message`;
    
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

  // Modify sendMessage function
  const sendMessage = async () => {
    const userInput = document.getElementById('user-input');
    const messageText = userInput.value.trim();

    if (messageText !== '') {
        displayUserMessage(messageText); // Display user's message
        userInput.value = '';

        const typingIndicator = showTypingIndicator(); // Show the typing indicator

        setTimeout(async () => {
            typingIndicator.remove(); // Remove the typing indicator

            // Function to check if the message consists solely of emojis
            const isOnlyEmojis = (text) => {
                const emojiRegexPattern = /^(\p{Emoji_Presentation}|\p{Extended_Pictographic}|\p{Emoji_Modifier_Base}|\p{Emoji_Component}|\s)+$/u;
                return emojiRegexPattern.test(text);
            };

            // Function to check if the message contains at least one emoji
            const containsEmoji = (text) => {
                const emojiRegexPattern = /(\p{Emoji_Presentation}|\p{Extended_Pictographic}|\p{Emoji_Modifier_Base}|\p{Emoji_Component})/u;
                return emojiRegexPattern.test(text);
            };

            // Funny or follow-up messages for when the chatbot "doesn't understand" the emoji
            const funnyMessages = [
              "Hmm, I'm still learning about emojis 😅",
              "If only I could understand emojis as well as I do text!",
              "To make sure I understand you, best to not mix text with emojis! 🙏"
          ];

            // Select a random funny message
            const getRandomFunnyMessage = () => funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

            if (isOnlyEmojis(messageText)) {
                const emojiResponse = getRandomEmoji(); // Respond with a random emoji if the input is solely emojis
                displayChatbotMessage(emojiResponse);
            } else if (containsEmoji(messageText)) {
                const funnyResponse = getRandomFunnyMessage(); // Provide a funny follow-up if the message contains emojis
                displayChatbotMessage(funnyResponse);
            } else {
                // Attempt to find and display an answer for text-only messages
                try {
                    const answer = await findAnswer(messageText);
                    displayChatbotMessage(answer); // Display chatbot's answer
                } catch (error) {
                    console.error('Error processing request:', error);
                    displayChatbotMessage("I'm sorry, there was an error processing your request: " + error.message);
                }
            }
        }, 2000); // Adjust the delay as needed
    }
};


// Make sure getRandomEmoji function is defined as shown in previous examples.
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
  };

    const toggleChatWidget = () => {
      const chatWidget = document.querySelector('.chat-widget');
      chatWidget.classList.toggle('minimized');
    };
  
  // Event listeners for sending messages
  document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
  document.getElementById('send-btn').addEventListener('click', sendMessage);
  document.getElementById('minimize').addEventListener('click', toggleChatWidget);
  document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
});  