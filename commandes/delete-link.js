const { zokou } = require(__dirname + "/../framework/zokou");
const s = require(__dirname + "/../set");

// Simple link detector
function containsLink(text = "") {
    const linkRegex = /(https?:\/\/|www\.|t\.me|wa\.me|chat\.whatsapp\.com)/i;
    return linkRegex.test(text);
}

zokou({ nomCom: "deletelink", categorie: "Group" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, arg, auteurMessage } = commandeOptions;

    try {
        // Only admins/owner should use
        if (!ms.key.fromMe && s.OWNER_NUMBER && !auteurMessage.includes(s.OWNER_NUMBER)) {
            return repondre("❌ Huna ruhusa ya kutumia command hii.");
        }

        repondre("🛡️ Anti-Link activated!");

        // Listen to all messages in group (hook style if supported by framework)
        zk.ev.on("messages.upsert", async (chatUpdate) => {
            let msg = chatUpdate.messages[0];

            if (!msg.message) return;
            if (!msg.key.remoteJid.endsWith("@g.us")) return;

            let text =
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text ||
                msg.message.imageMessage?.caption ||
                "";

            if (containsLink(text)) {
                try {
                    await zk.sendMessage(msg.key.remoteJid, {
                        delete: msg.key
                    });

                    await zk.sendMessage(msg.key.remoteJid, {
                        text: `🚫 Link detected and deleted!\n👤 User: @${msg.key.participant?.split("@")[0]}`,
                        mentions: [msg.key.participant]
                    });
                } catch (e) {
                    console.log("Delete link error:", e);
                }
            }
        });

    } catch (e) {
        console.log(e);
        repondre("❌ Error activating anti-link");
    }
});
