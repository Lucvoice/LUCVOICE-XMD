const { zokou } = require(__dirname + "/../framework/zokou");

zokou({ nomCom: "tagadmin", categorie: "Group" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, isBotAdmin } = commandeOptions;

    try {
        if (!isBotAdmin) return repondre("❌ Bot must be an admin.");

        let metadata = await zk.groupMetadata(dest);

        let admins = metadata.participants
            .filter(p => p.admin === "admin" || p.admin === "superadmin")
            .map(p => p.id);

        if (admins.length === 0) {
            return repondre("❌ Hakuna admins kwenye group hii.");
        }

        let text = `📢 *LUCVOICE-XMD ADMIN TAG*\n\n👑 Attention Admins!`;

        await zk.sendMessage(dest, {
            text: text,
            mentions: admins
        }, { quoted: ms });

    } catch (e) {
        console.log("Tagadmin error:", e);
        repondre("❌ Error kwenye tagadmin command");
    }
});
