const { zokou } = require(__dirname + "/../framework/zokou");

zokou({ nomCom: "group", categorie: "Group" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, arg, isAdmin, isBotAdmin } = commandeOptions;

    try {
        if (!isAdmin) return repondre("❌ Only group admins can use this command.");
        if (!isBotAdmin) return repondre("❌ Bot must be an admin.");

        if (!arg || !arg[0]) {
            return repondre(
`👥 *LUCVOICE-XMD GROUP COMMAND*

Tumia:
.group open
.group close
.group link
.group info`
            );
        }

        let action = arg[0].toLowerCase();

        // OPEN GROUP
        if (action === "open") {
            await zk.groupSettingUpdate(dest, "not_announcement");
            return repondre("🟢 Group is now OPEN for all members.");
        }

        // CLOSE GROUP
        if (action === "close") {
            await zk.groupSettingUpdate(dest, "announcement");
            return repondre("🔴 Group is now CLOSED (admins only).");
        }

        // GROUP LINK
        if (action === "link") {
            let code = await zk.groupInviteCode(dest);
            let link = `https://chat.whatsapp.com/${code}`;

            return repondre(`🔗 *Group Invite Link:*\n${link}`);
        }

        // GROUP INFO
        if (action === "info") {
            let metadata = await zk.groupMetadata(dest);

            let text = `
╭━━〔 👥 LUCVOICE-XMD GROUP INFO 〕━━╮
┃ 📛 Name : ${metadata.subject}
┃ 👤 Members : ${metadata.participants.length}
┃ 👑 Admins : ${metadata.participants.filter(p => p.admin).length}
┃ 🆔 Group ID : ${metadata.id}
╰━━━━━━━━━━━━━━━━━━━━━━╯
`;

            return repondre(text);
        }

        return repondre("❌ Invalid option. Use open, close, link, info.");

    } catch (e) {
        console.log("Group error:", e);
        repondre("❌ Error kwenye group command");
    }
});
