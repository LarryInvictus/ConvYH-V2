// server.js
const express = require("express");
const crypto = require("crypto");
const { SocksProxyAgent } = require("socks-proxy-agent");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// SOCKS5 proxy
const agent = new SocksProxyAgent("socks5://216.106.179.216:49274");

// Shared secret (same as in frontend)
const SECRET = "convYH_V2_secret_key_123";

// Simple AES helper
function decryptPayload(encryptedBase64) {
    const data = Buffer.from(encryptedBase64, "base64");
    const iv = data.subarray(0, 16);
    const text = data.subarray(16);

    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        crypto.createHash("sha256").update(SECRET).digest(),
        iv
    );
    let decrypted = decipher.update(text, undefined, "utf8");
    decrypted += decipher.final("utf8");
    return JSON.parse(decrypted);
}

function encryptPayload(obj) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        crypto.createHash("sha256").update(SECRET).digest(),
        iv
    );
    let enc = cipher.update(JSON.stringify(obj), "utf8");
    enc = Buffer.concat([enc, cipher.final()]);
    return Buffer.concat([iv, enc]).toString("base64");
}

// Encrypted proxy endpoint
app.post("/proxy", async (req, res) => {
    try {
        const decrypted = decryptPayload(req.body.data);
        const url = decrypted.url;

        const response = await fetch(url, { agent });
        const text = await response.text();

        const encrypted = encryptPayload({ url, content: text });
        res.json({ data: encrypted });
    } catch (err) {
        const encrypted = encryptPayload({ error: err.toString() });
        res.json({ data: encrypted });
    }
});

app.listen(3000, () => {
    console.log("ConvYH V2 Secure Proxy running on port 3000");
});
