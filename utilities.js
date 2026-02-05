const crypto = require("crypto");

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

function verifySignature(payload, signature) {
    const hash = crypto
        .createHmac("sha256", WEBHOOK_SECRET)
        .update(JSON.stringify(payload))
        .digest("hex");

    return hash === signature;
}

const events = [
    "user.created",
    // "user.updated"
];

module.exports = { verifySignature, events };