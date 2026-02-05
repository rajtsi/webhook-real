const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());


const { verifySignature, verifyGithubSignature, events } = require("./utilities");
const { handleEvent } = require("./services/webhookService");
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;



app.post("/webhook", async (req, res) => {

  // 1️⃣ Detect source type
  const githubEvent = req.headers["x-github-event"];
  const customEvent = req.body?.event;

  // Decide event name
  const event = githubEvent || customEvent;

  if (!event) {
    return res.status(400).send("Missing event identifier");
  }

  // 2️⃣ Verify signature differently per source
  const isGithub = !!githubEvent;

  let valid = false;

  if (isGithub) {
    // --- GitHub verification ---
    const sig = req.headers["x-hub-signature-256"];
    valid = verifyGithubSignature(req.body, sig);
  } else {
    // --- Your custom verification ---
    const sig = req.headers["x-webhook-signature"];
    valid = verifySignature(req.body, sig);
  }

  if (!valid) {
    return res.status(401).send("Invalid signature");
  }

  // 3️⃣ Data extraction
  const data = isGithub ? req.body : req.body.data;

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