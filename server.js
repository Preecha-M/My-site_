const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(cors());

// Serve static HTML
app.use(express.static(path.join(__dirname, 'public')));

let messages = []; // Store chat messages
let clients = []; // Store pending poll requests

app.post('/send', (req, res) => {
    const { message } = req.body;
    if (message) {
        messages.push(message);

        // Notify all waiting clients
        clients.forEach((client) => client.res.json({ messages: [message] }));
        clients = []; // Clear the clients list
    }
    res.status(200).send('Message received');
});

app.get('/poll', (req, res) => {
    if (messages.length > 0) {
        const messagesToSend = [...messages];
        messages = []; // Clear the messages array
        res.json({ messages: messagesToSend });
    } else {
        clients.push({ req, res });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
