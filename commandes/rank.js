const { zokou } = require(__dirname + "/../framework/zokou");

// ===============================
// 💾 SIMPLE DATABASE (IN MEMORY)
// ===============================
let userDB = {};

// ===============================
// ⚡ XP SYSTEM
// ===============================
function addXP(user) {
    if (!userDB[user]) {
        userDB[user] = { xp: 0, messages: 0 };
    }

    let gained = Math.floor(Math.random() * 15) + 5; // 5 - 20 XP
    userDB[user].xp += gained;
    userDB[user].messages += 1;
}

function getLevel(xp) {
    return Math.floor(0.2 * Math.sqrt(xp));
}

function getRank(level) {
    if (level >= 70) return "👑 LUCVOICE KING";
    if (level >= 50) return "🔥 LEGEND";
    if (level >= 35) return "💎 ELITE USER";
    if (level >= 20) return "⚡ ADVANCED USER";
    if (level >= 10) return "🌟 ACTIVE USER";
    return "🌱 NEW MEMBER";
}

function progressBar(xp) {
    let level = getLevel(xp);
    let nextLevelXP = Math.pow((level + 1) / 0.2, 2);
    let currentLevelXP = Math.pow(level / 0.2, 2);

    let progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 10;
    progress = Math.max(0, Math.min(10, Math.floor(progress)));

    let bar = "█".repeat(progress) + "░".repeat(10 - progress);
    return bar;
}

// ===============================
// 🏆 RANK COMMAND
// ===============================
zokou({ nomCom: "rank", categorie: "LUCVOICE-XMD" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, auteurMessage } = commandeOptions;

    try {
        let user = auteurMessage;

        if (!userDB[user]) {
            userDB[user] = { xp: 0, messages: 0 };
        }

        let data = userDB[user];
        let xp = data.xp;
        let level = getLevel(xp);
        let rank = getRank(level);

        let bar = progressBar(xp);

        let text = `
╭━━〔 🏆 LUCVOICE-XMD RANK SYSTEM 〕━━╮
┃ 👤 User    : ${user.split("@")[0]}
┃ ⭐ XP      : ${xp}
┃ 📊 Level   : ${level}
┃ 🎖️ Rank   : ${rank}
┃ 💬 Msgs    : ${data.messages}
┃
┃ 📈 Progress
┃ [${bar}]
╰━━━━━━━━━━━━━━━━━━━━━━╯

💡 Keep chatting to earn XP in LUCVOICE-XMD 🚀
`;

        return repondre(text);

    } catch (e) {
        console.log(e);
        repondre("❌ Error kwenye LUCVOICE-XMD rank system");
    }
});

// ===============================
// ⚡ EXPORT XP FUNCTION (use in message handler)
// ===============================
module.exports = {
    addXP
};
