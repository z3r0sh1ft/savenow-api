const axios = require("axios");

module.exports = async (req, res) => {
    try {
        const { url, format = "720" } = req.query;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "Missing 'url' parameter."
            });
        }

        const response = await axios.get(
            "https://p.savenow.to/api/v2/download",
            {
                params: {
                    url,
                    format,
                    apikey: process.env.SAVENOW_API_KEY
                },
                timeout: 30000
            }
        );

        const data = response.data;

        return res.status(200).json({
            success: data.success,
            id: data.id,
            progress_url: data.progress_url,
            title: data.title,
            thumbnail: data.thumbnail_url,
            format: data.format,
            full_format: data.full_format,
            status: data.text
        });

    } catch (err) {

        if (err.response) {
            return res.status(err.response.status).json(err.response.data);
        }

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};