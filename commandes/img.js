const { zokou } = require(__dirname + "/../framework/zokou");
const axios = require("axios");

zokou({ nomCom: "img", categorie: "Search" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, arg } = commandeOptions;

    try {
        if (!arg || arg.length === 0) {
            return repondre("❌ Tumia: .img <keyword>\nMfano: .img cat");
        }

        let query = arg.join(" ");

        repondre("🔎 Searching images, tafadhali subiri...");

        // Free image API (replace if needed)
        let url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=YOUR_UNSPLASH_ACCESS_KEY`;

        let res = await axios.get(url);

        if (!res.data.results || res.data.results.length === 0) {
            return repondre("❌ Hakuna image lililopatikana.");
        }

        let imageUrl = res.data.results[0].urls.regular;

        await zk.sendMessage(dest, {
            image: { url: imageUrl },
            caption: `🖼️ *IMAGE RESULT*\n\n🔎 Query: ${query}`
        }, { quoted: ms });

    } catch (e) {
        console.log("IMG error:", e.response?.data || e.message);
        repondre("❌ Error kupata image.");
    }
});
