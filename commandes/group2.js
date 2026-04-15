const { zokou } = require(__dirname + "/../framework/zokou");

zokou({ nomCom: "group2", categorie: "Group" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, arg, isAdmin, isBotAdmin, mentionedJid } = commandeOptions;

    try {
        if (!isAdmin) return repondre("❌ Only admins can use this command.");
        if (!isBotAdmin) return repondre("❌ Bot must be an admin.");

        if (!arg || !arg[0]) {
            return repondre(
`👥 *LUCVOICE-XMD GROUP2 COMMAND*

Tumia:
.group2 kick
.group2 add
.group2 promote
.group2 demote
.group2 mute
.group2 unmute
.group2 tagall`
            );
        }

        let action = arg[0].toLowerCase();

        // ===============================
        // KICK USER
        // ===============================
        if (action === "kick") {
            let user = mentionedJid[0];
            if (!user) return repondre("❌ Tag user to kick.");

            await zk.groupParticipantsUpdate(dest, [user], "remove");
            return repondre("👢 User kicked successfully.");
        }

        // ===============================
        // ADD USER
        // ===============================
        if (action === "add") {
            let number = arg[1];
            if (!number) return repondre("❌ Provide number to add.");

            let jid = number.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

            await zk.groupParticipantsUpdate(dest, [jid], "add");
            return repondre("➕ User added successfully.");
        }

        // ===============================
        // PROMOTE
        // ===============================
        if (action === "promote") {
            let user = mentionedJid[0];
            if (!user) return repondre("❌ Tag user to promote.");

            await zk.groupParticipantsUpdate(dest, [user], "promote");
            return repondre("👑 User promoted to admin.");
        }

        // ===============================
        // DEMOTE
        // ===============================
        if (action === "demote") {
            let user = mentionedJid[0];
            if (!user) return repondre("❌ Tag user to demote.");

            await zk.groupParticipantsUpdate(dest, [user], "demote");
            return repondre("⬇️ User demoted from admin.");
        }

        // ===============================
        // MUTE GROUP
        // ===============================
        if (action === "mute") {
            await zk.groupSettingUpdate(dest, "announcement");
            return repondre("🔇 Group muted (admins only).");
        }

        // ===============================
        // UNMUTE GROUP
        // ===============================
        if (action === "unmute") {
            await zk.groupSettingUpdate(dest, "not_announcement");
            return repondre("🔊 Group unmuted (all members).");
        }

        // ===============================
        // TAG ALL MEMBERS
        // ===============================
        if (action === "tagall") {
            let metadata = await zk.groupMetadata(dest);
            let users = metadata.participants.map(p => p.id);

            return zk.sendMessage(dest, {
                text: "📢 *LUCVOICE-XMD TAG ALL* 🔔",
                mentions: users
            }, { quoted: ms });
        }

        return repondre("❌ Unknown option.");

    } catch (e) {
        console.log("Group2 error:", e);
