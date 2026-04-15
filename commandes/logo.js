const { zokou } = require(__dirname + "/../framework/zokou");
const axios = require("axios");

zokou({ nomCom: "logo", categorie: "Tools" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, arg } = commandeOptions;

    try {
        if (!arg || arg.length < 2) {
            return repondre("❌ Tumia: .logo <style> <text>\nMfano: .logo neon Luka");
        }

        let style = arg[0];
        let text = arg.slice(1).join(" ");

        repondre("🎨 Generating logo, tafadhali subiri...");

        // Simple free API (replace if you have better one)
        let url = `https://api.popcat.xyz/logo?text=${encodeURIComponent(text)}&style=${encodeURIComponent(style)}`;

        await zk.sendMessage(dest, {
            image: { url: url },
            caption: `🖼️ *LOGO GENERATED*\n\n🎨 Style: ${style}\n📝 Text: ${text}`
        }, { quoted: ms });

    } catch (e) {
        console.log("Logo error:", e);
        repondre("❌ Failed to generate logo.");
    }
});
