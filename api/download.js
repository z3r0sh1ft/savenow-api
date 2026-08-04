const axios = require("axios");

module.exports = async (req, res) => {
    // -----------------------------
    // CORS
    // -----------------------------
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight request
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // Only allow GET
    if (req.method !== "GET") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed"
        });
    }

    try {
        const { url, format = "720" } = req.query;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "Missing 'url' query parameter."
            });
        }

        if (!process.env.savenow_api_key) {
            return res.status(500).json({
                success: false,
                message: "savenow_api_key is not configured."
            });
        }

        const response = await axios.get(
            "https://p.savenow.to/api/v2/download",
            {
                params: {
                    url,
                    format,
                    apikey: process.env.savenow_api_key
                },
                timeout: 30000,
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            }
        );

        const data = response.data;

        return res.status(200).json({
            success: data.success,
            id: data.id,
            progress_url: data.progress_url,
            status: data.text,

            title: data.title,

            info: data.info,

            thumbnail_url: data.thumbnail_url,

            format: data.format,

            full_format: data.full_format
        });

    } catch (err) {

        console.error(err.response?.data || err.message);

        if (err.response) {
            return res.status(err.response.status).json({
                success: false,
                status: err.response.status,
                error: err.response.data
            });
        }

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};