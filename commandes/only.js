const { zokou } = require(__dirname + "/../framework/zokou");

zokou({ nomCom: "only", categorie: "Group" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, arg, isAdmin, isBotAdmin } = commandeOptions;

    try {
        if (!isAdmin) return repondre("❌ This command is for admins only.");
        if (!isBotAdmin) return repondre("❌ Bot must be an admin.");

        if (!arg || !arg[0]) {
            return repondre(
                "❌ Tumia:\n.only admin\n.only members\n.only bot"
            );
        }

        let mode = arg[0].toLowerCase();

        // ONLY ADMINS MODE
        if (mode === "admin") {
            await zk.groupSettingUpdate(dest, "announcement");
            return repondre("🔐 Group is now in *ADMIN ONLY MODE*.");
        }

        // ALL MEMBERS MODE
        if (mode === "members") {
            await zk.groupSettingUpdate(dest, "not_announcement");
            return repondre("👥 Group is now open for *ALL MEMBERS*.");
        }

        // ONLY BOT MODE (restrict chatting by removing others - simulation)
        if (mode === "bot") {
            return repondre("🤖 Bot-only mode is not fully supported via WhatsApp API, but you can use mute + anti-chat system.");
        }

        return repondre("❌ Invalid option. Use admin, members, or bot.");

    } catch (e) {
        console.log(e);
        repondre("❌ Error kwenye only command");
    }
});
