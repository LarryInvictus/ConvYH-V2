const express = require("express");
const { SocksProxyAgent } = require("socks-proxy-agent");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const agent = new SocksProxyAgent("socks5://216.106.179.216:49274");

app.post("/proxy", async (req, res) => {
    try {
        const url = req.body.url;

        const response = await fetch(url, { agent });
        const text = await response.text();

        res.send({
            url,
            content: text
        });
    } catch (err) {
        res.send({ error: err.toString() });
    }
});

app.listen(3000, () => {
    console.log("ConvYH V2 Proxy Relay running on port 3000");
});
