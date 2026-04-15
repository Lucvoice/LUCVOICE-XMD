const { zokou } = require("../framework/zokou");
const s = require("../set");

// toggle system
let ANTI_LINK = true;

zokou({
    nomCom: "antilink",
    categorie: "Group",
    reaction: "🚫",
    desc: "Anti link kick system"
}, async (dest, zk, commandeOptions) => {

    const { ms, repondre, superUser, verifGroupe } = commandeOptions;

    if (!verifGroupe) {
        return repondre("❌ This command works only in groups!");
    }

    if (!superUser) {
        return repondre("❌ Only owner can toggle anti-link!");
    }

    ANTI_LINK = !ANTI_LINK;

    await repondre(`🚫 Anti-Link is now *${ANTI_LINK ? "ACTIVE" : "DISABLED"}*`);
});

// 📵 Link detection in group messages
zk.ev.on("messages.upsert", async (m) => {
    try {
        if (!ANTI_LINK) return;

        const msg = m.messages[0];
        if (!msg.message) return;

        const jid = msg.key.remoteJid;

        // only groups
        if (!jid.endsWith("@g.us")) return;

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            "";

        // link patterns
        const linkRegex = /(https?:\/\/|wa\.me|chat\.whatsapp\.com|t\.me)/gi;

        if (linkRegex.test(text)) {

            const sender = msg.key.participant || msg.key.remoteJid;

            // delete message (if bot admin)
            await zk.sendMessage(jid, {
                delete: msg.key
            });

            // kick user
            await zk.groupParticipantsUpdate(jid, [sender], "remove");

            // warning message
            await zk.sendMessage(jid, {
                text: `🚫 *ANTI-LINK ALERT*

👤 User: @${sender.split("@")[0]}
❌ Sent a link and was removed!

⚠️ Links are not allowed in this group.`,
                mentions: [sender]
            });

        }

    } catch (e) {
        console.log("AntiLink error:", e);
    }
});
