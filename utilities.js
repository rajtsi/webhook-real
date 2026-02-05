function verifyGithubSignature(payload, signature) {
    if (!signature) return false;

    const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
    const digest =
        "sha256=" + hmac.update(JSON.stringify(payload)).digest("hex");

    return crypto.timingSafeEqual(
        Buffer.from(digest),
        Buffer.from(signature)
    );
}
const events = [
    "user.created",
    // "user.updated"
];
module.exports = {
    verifySignature,
    verifyGithubSignature,
    events
};

