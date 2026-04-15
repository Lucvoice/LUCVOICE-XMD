const { zokou } = require(__dirname + "/../framework/zokou");

// GET GROUP LINK
zokou({ nomCom: "link", categorie: "Group" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, isAdmin, isBotAdmin } = commandeOptions;

    try {
        if (!isAdmin) return repondre("❌ This command is for admins only.");
        if (!isBotAdmin) return repondre("❌ Bot must be an admin in this group.");

        let code = await zk.groupInviteCode(dest);
        let link = "https://chat.whatsapp.com/" + code;

        return repondre(
            `🔗 *GROUP INVITE LINK*\n\n` +
            `${link}\n\n` +
            `📌 Share this link to invite new members.`
        );

    } catch (e) {
        console.log(e);
        repondre("❌ Failed to get group link.");
    }
});


// REVOKE GROUP LINK (Generate new link)
zokou({ nomCom: "revoke", categorie: "Group" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, isAdmin, isBotAdmin } = commandeOptions;

    try {
        if (!isAdmin) return repondre("❌ This command is for admins only.");
        if (!isBotAdmin) return repondre("❌ Bot must be an admin in this group.");

        // Revoke old invite link
        await zk.groupRevokeInvite(dest);

        // Generate new link
        let newCode = await zk.groupInviteCode(dest);
        let newLink = "https://chat.whatsapp.com/" + newCode;

        return repondre(
            `♻️ *GROUP LINK REVOKED SUCCESSFULLY*\n\n` +
            `🔗 New Invite Link:\n${newLink}`
        );

    } catch (e) {
        console.log(e);
        repondre("❌ Failed to revoke group link.");
    }
});
