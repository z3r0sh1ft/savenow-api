require("dotenv").config();

const express = require("express");

const download = require("./api/download");
const progress = require("./api/progress");

const app = express();

app.get("/api/download", download);
app.get("/api/progress", progress);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});