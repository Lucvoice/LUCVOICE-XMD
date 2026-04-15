const { zokou } = require(__dirname + "/../framework/zokou");

zokou({ nomCom: "tag", categorie: "Group" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, isAdmin, isBotAdmin } = commandeOptions;

    try {
        if (!isAdmin) return repondre("❌ Only admins can use this command.");
        if (!isBotAdmin) return repondre("❌ Bot must be an admin.");

        let metadata = await zk.groupMetadata(dest);
        let participants = metadata.participants;

        let mentions = participants.map(p => p.id);

        let text = `📢 *LUCVOICE-XMD TAG ALL*\n\n🔔 Attention everyone!`;

        await zk.sendMessage(dest, {
            text: text,
            mentions: mentions
        }, { quoted: ms });

    } catch (e) {
        console.log("Tag error:", e);
        repondre("❌ Error kwenye tag command");
    }
});

// ===============================
// 🧑 TAG SPECIFIC USER
// ===============================
zokou({ nomCom: "taguser", categorie: "Group" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, arg } = commandeOptions;

    try {
        if (!arg || !arg[0]) {
            return repondre("❌ Tumia: .taguser @user message");
        }

        let text = arg.slice(1).join(" ") || "Hello!";
        let user = arg[0].replace("@", "") + "@s.whatsapp.net";

        await zk.sendMessage(dest, {
            text: `📢 *LUCVOICE-XMD TAG*\n\n${text}`,
            mentions: [user]
        }, { quoted: ms });

    } catch (e) {
        console.log("Taguser error:", e);
        repondre("❌ Error kwenye taguser command");
    }
});
