const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());


const { verifySignature, events } = require("./utilities");
const { handleEvent } = require("./services/webhookService");
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;



app.post("/webhook", async (req, res) => {
  const signature = req.headers["x-webhook-signature"];

  if (!verifySignature(req.body, signature)) {
    return res.status(401).send("Invalid signature");
  }

  const { event, data } = req.body;
  if (!event) {
    return res.status(400).send("Missing event");
  }

  try {
    await handleEvent(event, data);
    res.status(200).send("ok");
  } catch (err) {
    console.error("Error handling event:", err);
    res.status(500).send("internal error");
  }
});

function result(message, statusCode, data = null) {
  return {
    message,
    statusCode,
    result: data,
  };
}

app.get("/", (req, res) => {
  res.send(result("Webhook service running", 200));
});

app.get("/test-webhook", (req, res) => {


  events.forEach((eventName, index) => {
    setTimeout(() => {
      const payload = {
        event: eventName,
        data: { id: index + 1, timestamp: new Date().toISOString() },
      };

      const signature = crypto
        .createHmac("sha256", WEBHOOK_SECRET)
        .update(JSON.stringify(payload))
        .digest("hex");

      fetch(`http://localhost:${PORT}/webhook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-signature": signature,
        },
        body: JSON.stringify(payload),
      }).catch((err) => console.error(`Failed to trigger ${eventName}:`, err));
    }, index * 100);
  });

  setTimeout(() => {
    res.status(200).send("ok");
  }, 10000);


});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on ${PORT}`));