const crypto = require("crypto");

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

function verifySignature(payload, signature) {
    if (!signature) return false;

    const hash = crypto
        .createHmac("sha256", WEBHOOK_SECRET)
        .update(JSON.stringify(payload))
        .digest("hex");

    return hash === signature;
}

function verifyGithubSignature(payload, signature) {
    if (!signature) return false;

    const expected =
        "sha256=" +
        crypto.createHmac("sha256", WEBHOOK_SECRET)
            .update(JSON.stringify(payload))
            .digest("hex");

    try {
        return crypto.timingSafeEqual(
            Buffer.from(expected),
            Buffer.from(signature)
        );
    } catch {
        return false;
    }
}

const events = [
    "user.created",
];

module.exports = {
    verifySignature,
    verifyGithubSignature,
    events
};