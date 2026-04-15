const { zokou } = require(__dirname + "/../framework/zokou");
const fs = require("fs-extra");

zokou({ nomCom: "vior", categorie: "Media" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre } = commandeOptions;

    try {
        // Get replied message
        let quoted = ms.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted) {
            return repondre("❌ Please reply to a view-once image or video.");
        }

        // Detect view-once message
        let viewOnce =
            quoted.viewOnceMessage ||
            quoted.viewOnceMessageV2 ||
            quoted.viewOnceMessageV2Extension;

        if (!viewOnce) {
            return repondre("❌ This is not a view-once message.");
        }

        repondre("👁️ Extracting view-once media... please wait");

        let mediaMsg = viewOnce.message;

        // Download media
        let filePath = await zk.downloadAndSaveMediaMessage({
            message: mediaMsg
        });

        let isVideo = mediaMsg.videoMessage ? true : false;

        // Send extracted media
        if (isVideo) {
            await zk.sendMessage(dest, {
                video: fs.readFileSync(filePath),
                caption: "👁️ *LUCVOICE-XMD VIEW ONCE EXTRACTED*"
            }, { quoted: ms });
        } else {
            await zk.sendMessage(dest, {
                image: fs.readFileSync(filePath),
                caption: "👁️ *LUCVOICE-XMD VIEW ONCE EXTRACTED*"
            }, { quoted: ms });
        }

    } catch (e) {
        console.log("Vior error:", e);
        repondre("❌ Failed to extract view-once media.");
    }
});
