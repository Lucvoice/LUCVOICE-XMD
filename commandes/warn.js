const { zokou } = require(__dirname + "/../framework/zokou");

// Simple warning database (in-memory)
let warnings = {};

function getUser(id) {
    if (!warnings[id]) {
        warnings[id] = { count: 0 };
    }
    return warnings[id];
}

zokou({ nomCom: "warn", categorie: "Group" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, arg, isAdmin, isBotAdmin, auteurMessage } = commandeOptions;

    try {
        if (!isAdmin) return repondre("❌ Only admins can use this command.");
        if (!isBotAdmin) return repondre("❌ Bot must be admin.");

        let target = ms.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

        if (!target) {
            return repondre("❌ Tag a user to warn.\nExample: .warn @user reason");
        }

        let reason = arg.slice(1).join(" ") || "No reason provided";

        let userData = getUser(target);
        userData.count += 1;

        let warnCount = userData.count;

        await zk.sendMessage(dest, {
            text:
`⚠️ *LUCVOICE-XMD WARNING SYSTEM*

👤 User: @${target.split("@")[0]}
⚠️ Warnings: ${warnCount}
📌 Reason: ${reason}

🚨 Be careful! Too many warnings may lead to removal.`,
            mentions: [target]
        }, { quoted: ms });

    } catch (e) {
        console.log("Warn error:", e);
        repondre("❌ Error issuing warning");
    }
});
