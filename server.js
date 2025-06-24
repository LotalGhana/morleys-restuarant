const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH;
const client = twilio(accountSid, authToken);

app.post('/send-sms', (req, res) => {
  const { phone, message } = req.body;

  client.messages
    .create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: phone,
    })
    .then(() => res.json({ success: true }))
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: "Failed to send SMS" });
    });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
