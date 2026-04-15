const { zokou } = require(__dirname + "/../framework/zokou");
const axios = require("axios");

zokou({ nomCom: "url", categorie: "Tools" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, arg } = commandeOptions;

    try {
        if (!arg || !arg[0]) {
            return repondre("❌ Tumia: .url <link>\nMfano: .url https://google.com");
        }

        let link = arg[0];

        repondre("🔗 Shortening URL, tafadhali subiri...");

        // Free shortening API
        let res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(link)}`);

        let shortUrl = res.data;

        await zk.sendMessage(dest, {
            text: `
╭━━〔 🔗 LUCVOICE-XMD URL SHORTENER 〕━━╮
┃ 🌐 Original: ${link}
┃ ✂️ Short URL: ${shortUrl}
╰━━━━━━━━━━━━━━━━━━━━━━╯

🚀 Powered by LUCVOICE-XMD
`
        }, { quoted: ms });

    } catch (e) {
        console.log("URL error:", e);
        repondre("❌ Error kufupisha link");
    }
});
