const { zokou } = require("../framework/zokou");

let blockedUsers = [];

zokou({
    nomCom: "block",
    categorie: "Owner",
    reaction: "🚫",
    desc: "Block a user"
}, async (dest, zk, commandeOptions) => {

    const { ms, repondre, superUser, arg } = commandeOptions;

    if (!superUser) {
        return repondre("❌ Only owner can use this command!");
    }

    let user = ms.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!user) {
        return repondre("❌ Mention a user to block!\nExample: .block @user");
    }

    if (!blockedUsers.includes(user)) {
        blockedUsers.push(user);
    }

    await repondre(`🚫 User blocked successfully!\n👤 ${user.split("@")[0]}`);
});


zokou({
    nomCom: "unblock",
    categorie: "Owner",
    reaction: "✅",
    desc: "Unblock a user"
}, async (dest, zk, commandeOptions) => {

    const { ms, repondre, superUser } = commandeOptions;

    if (!superUser) {
        return repondre("❌ Only owner can use this command!");
    }

    let user = ms.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!user) {
        return repondre("❌ Mention a user to unblock!\nExample: .unblock @user");
    }

    blockedUsers = blockedUsers.filter(u => u !== user);

    await repondre(`✅ User unblocked!\n👤 ${user.split("@")[0]}`);
});


zokou({
    nomCom: "blocklist",
    categorie: "Owner",
    reaction: "📋",
    desc: "Show blocked users"
}, async (dest, zk, commandeOptions) => {

    const { repondre } = commandeOptions;

    if (blockedUsers.length === 0) {
        return repondre("📋 No blocked users yet.");
    }

    let list = "🚫 *BLOCKED USERS LIST*\n\n";

    blockedUsers.forEach((user, i) => {
        list += `${i + 1}. ${user.split("@")[0]}\n`;
    });

    await repondre(list);
});
