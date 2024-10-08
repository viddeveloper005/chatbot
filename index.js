const express = require('express')
const bodyParser = require('body-parser')
const natural = require('natural')
const fs = require('fs')
const cors = require('cors')
    // Setup Express and Body Parser
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(cors())
    // Load dataset (intents and utterances)
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'))

// Create a classifier
const classifier = new natural.BayesClassifier()

// Add utterances and corresponding intent for training
Object.keys(data).forEach(intent => {
    data[intent].utterances.forEach(utterance => {
        classifier.addDocument(utterance.toLowerCase(), intent)
    })
})

// Train the classifier
classifier.train()

// Chatbot endpoint
app.post('/chat', (req, res) => {
    const userMessage = req.body.message.toLowerCase()
    console.log(userMessage)
        // Classify the user's input message
    const detectedIntent = classifier.classify(userMessage)

    // Retrieve responses based on detected intent
    const intentData = data[detectedIntent]
    if (intentData) {
        // Choose a random response from the available responses for this intent
        const randomIndex = Math.floor(Math.random() * intentData.responses.length)
        const reply = intentData.responses[randomIndex]
        res.json({ reply: reply })
    } else {
        // If the intent isn't recognized
        res.json({ reply: "Sorry, I don't understand that." })
    }
})

// Start the server
app.listen(port, () => {
    console.log(`Chatbot running on http://localhost:${port}`)
})