const { zokou } = require("../framework/zokou");

// toggle system
let ANTI_TAG = true;

const OWNER_NAME = "LUKA iT";

zokou({
    nomCom: "antitag",
    categorie: "Group",
    reaction: "🏷️",
    desc: "Anti-tag protection system"
}, async (dest, zk, commandeOptions) => {

    const { ms, repondre, superUser, verifGroupe } = commandeOptions;

    if (!verifGroupe) {
        return repondre("❌ This command works only in groups!");
    }

    if (!superUser) {
        return repondre("❌ Only owner can toggle anti-tag!");
    }

    ANTI_TAG = !ANTI_TAG;

    await repondre(`🏷️ Anti-Tag is now *${ANTI_TAG ? "ACTIVE" : "DISABLED"}*`);
});

// 📌 MESSAGE HANDLER
zk.ev.on("messages.upsert", async (m) => {
    try {
        if (!ANTI_TAG) return;

        const msg = m.messages[0];
        if (!msg.message) return;

        const jid = msg.key.remoteJid;

        if (!jid.endsWith("@g.us")) return;

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            "";

        const sender = msg.key.participant || msg.key.remoteJid;

        // detect excessive tagging (@)
        const tagCount = (text.match(/@/g) || []).length;

        if (tagCount >= 5) {

            // delete message
            await zk.sendMessage(jid, {
                delete: msg.key
            });

            // warn user
            await zk.sendMessage(jid, {
                text: `🏷️ *ANTI-TAG ALERT*

👤 User: @${sender.split("@")[0]}
❌ Too many tags detected (${tagCount})

⚠️ Please avoid tagging spam!

👑 Owner: ${OWNER_NAME}`,
                mentions: [sender]
            });

        }

    } catch (e) {
        console.log("AntiTag error:", e);
    }
});
