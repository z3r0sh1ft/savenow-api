const axios = require("axios");

module.exports = async (req, res) => {

    // ---------------------------------
    // CORS
    // ---------------------------------
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

        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Missing 'id' query parameter."
            });
        }

        const response = await axios.get(
            "https://p.savenow.to/api/progress",
            {
                params: { id },
                timeout: 30000,
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            }
        );

        const data = response.data;

        return res.status(200).json({
            success: Boolean(data.success),
            progress: Number(data.progress || 0),
            status: data.text || "",
            message: data.message || "",
            title: data.title || "",
            info: data.info || null,
            thumbnail_url: data.thumbnail_url || null,
            format: data.format || null,
            full_format: data.full_format || null,
            download_url: data.download_url || null
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