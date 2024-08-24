
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
import random
app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

generic_responses = [
    "I'm not quite sure what you're trying to say. Could you rephrase that?",
    "Sorry, I didn't get that. Can you ask in a different way?",
    "I'm having a little trouble understanding. Can you ask again?",
    "Hmm, I'm not sure how to respond to that. Can you provide more detail?",
    "Oops, that's beyond me. Maybe try asking something else?",
    "That's a stumper. Perhaps a different question might yield a better answer?",
    "I'm at a loss for words. Maybe try simplifying your question?",
    "I wish I could help with that, but I'm still learning. Ask me something else?",
    "I'm not sure I'm equipped to answer that question. Could we try a different topic?",
    "My circuits are getting tangled. Let's untangle the conversation with a new question."
]


@app.route('/')
def index():
    # Serve your HTML file here
    return render_template('index.html')

with open('website.json', 'r') as file:
    data = json.load(file)['faq']

@app.route('/ask', methods=['POST'])
def ask():
    user_input = request.json['message']
    # Here you would typically process the user_input with your chatbot logic
    response = process_chatbot_response(user_input)
    return jsonify(response)

def process_chatbot_response(input_text):
    input_text = input_text.lower()  # Convert to lower case for case-insensitive matching
    for item in data:
        if input_text == item['question'].lower():
            return {"answer": item['answer']}
    # If no match is found, randomly select a response from the list of generic responses
    return {"answer": random.choice(generic_responses)}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

