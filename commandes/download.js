const { zokou } = require(__dirname + "/../framework/zokou");
const axios = require("axios");

zokou({ nomCom: "download", categorie: "Downloader" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, arg } = commandeOptions;

    try {
        if (!arg || !arg[0]) {
            return repondre("❌ Tumia: .download <link>");
        }

        let url = arg[0];

        repondre("⏳ Downloading, tafadhali subiri...");

        // Example: simple metadata fetch (can be replaced with real API)
        let data;
        try {
            let res = await axios.get(`https://api.mservice.io/download?url=${encodeURIComponent(url)}`);
            data = res.data;
        } catch (e) {
            return repondre("❌ Imeshindikana kuprocess link hii.");
        }

        if (!data || !data.url) {
            return repondre("❌ Hakuna file lililopatikana.");
        }

        let caption = `
╭━━〔 📥 DOWNLOAD COMPLETE 〕━━╮
┃ 🔗 Link: ${url}
┃ 📄 Title: ${data.title || "Unknown"}
┃ ⏱ Duration: ${data.duration || "N/A"}
╰━━━━━━━━━━━━━━━━━━━━━━╯
`;

        // Send video or audio depending on type
        if (data.type === "audio") {
            await zk.sendMessage(dest, {
                audio: { url: data.url },
                mimetype: "audio/mp4"
            }, { quoted: ms });
        } else {
            await zk.sendMessage(dest, {
                video: { url: data.url },
                caption: caption
            }, { quoted: ms });
        }

    } catch (e) {
        console.log("Download error:", e);
        repondre("❌ Error kwenye download command.");
    }
});
