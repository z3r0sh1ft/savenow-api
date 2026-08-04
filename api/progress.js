const axios = require("axios");

module.exports = async (req, res) => {

    try {

        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Missing 'id' parameter."
            });
        }

        const response = await axios.get(
            "https://p.savenow.to/api/progress",
            {
                params: { id },
                timeout: 30000
            }
        );

        const data = response.data;

        return res.status(200).json({
            success: data.success,
            progress: data.progress,
            status: data.text,
            title: data.title,
            thumbnail: data.thumbnail_url,
            format: data.format,
            full_format: data.full_format,
            download_url: data.download_url || null
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