const { zokou } = require("../framework/zokou");
const fs = require("fs-extra");

// simple memory store (can be upgraded to DB)
let deletedMessages = [];

zokou({
    nomCom: "antidelete",
    categorie: "System",
    reaction: "🛡️",
    desc: "Anti delete system"
}, async (dest, zk, commandeOptions) => {

    const { ms, repondre } = commandeOptions;

    await repondre("🛡️ Anti-delete system is ACTIVE!");

});

// ⚠️ This part depends on your framework event system
// If zokou supports message delete event:

zk.ev.on("messages.delete", async (deleteInfo) => {
    try {
        const msg = deleteInfo?.messages?.[0];

        if (!msg || !msg.message) return;

        deletedMessages.push(msg);

        // try to recover text
        let text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            "📛 Media message deleted";

        const jid = msg.key.remoteJid;

        await zk.sendMessage(jid, {
            text: `🛡️ *ANTIDELETE ALERT*\n\n📩 Message recovered:\n\n➡️ ${text}`
        });

    } catch (e) {
        console.log("Anti-delete error:", e);
    }
});
