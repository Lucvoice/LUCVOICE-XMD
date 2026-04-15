const { zokou } = require(__dirname + "/../framework/zokou");
const fs = require("fs-extra");
const path = require("path");

zokou({ nomCom: "save", categorie: "Tools" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre } = commandeOptions;

    try {
        let message = ms.message;

        if (!message) {
            return repondre("❌ Hakuna media ya ku-save.");
        }

        let media =
            message.imageMessage ||
            message.videoMessage ||
            message.audioMessage ||
            message.documentMessage;

        if (!media) {
            return repondre("❌ Tafadhali reply media (image/video/audio/document).");
        }

        repondre("💾 Saving media, tafadhali subiri...");

        let stream = await zk.downloadAndSaveMediaMessage(ms);

        let fileName = path.join(__dirname, "../saved", Date.now());

        fs.ensureDirSync(path.join(__dirname, "../saved"));

        fs.renameSync(stream, fileName);

        return repondre(`✅ Media saved successfully!\n📁 File: ${fileName}`);

    } catch (e) {
        console.log("Save error:", e);
        repondre("❌ Error saving media");
    }
});
