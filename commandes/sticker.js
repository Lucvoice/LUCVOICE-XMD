const { zokou } = require(__dirname + "/../framework/zokou");

zokou({ nomCom: "sticker", categorie: "Media" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre } = commandeOptions;

    try {
        let quoted = ms.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted) {
            return repondre("❌ Tafadhali reply image au video kufanya sticker.");
        }

        repondre("🧾 Creating sticker, tafadhali subiri...");

        let media = await zk.downloadAndSaveMediaMessage(ms);

        await zk.sendMessage(dest, {
            sticker: { url: media }
        }, { quoted: ms });

    } catch (e) {
        console.log("Sticker error:", e);
        repondre("❌ Error kutengeneza sticker");
    }
});
