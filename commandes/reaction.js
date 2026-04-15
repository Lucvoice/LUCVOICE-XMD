const { zokou } = require(__dirname + "/../framework/zokou");

// ===============================
// 🎯 REACTION COMMAND
// ===============================
zokou({ nomCom: "react", categorie: "Fun" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, arg } = commandeOptions;

    try {
        if (!arg || arg.length < 2) {
            return repondre(
                "❌ Tumia:\n.react <emoji> <message>\n\nMfano:\n.react 😂 hello"
            );
        }

        let emoji = arg[0];
        let text = arg.slice(1).join(" ");

        await zk.sendMessage(dest, {
            text: `👍 *REACTION BOT*\n\n${emoji} ${text}`
        }, { quoted: ms });

    } catch (e) {
        console.log("Reaction error:", e);
        repondre("❌ Error kwenye reaction command");
    }
});

// ===============================
// 🤖 AUTO REACTION SYSTEM
// ===============================
zokou({ nomCom: "autoreact", categorie: "Fun" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre } = commandeOptions;

    try {
        global.autoReact = !global.autoReact;

        let status = global.autoReact ? "ON 🟢" : "OFF 🔴";

        repondre(`🤖 AUTO REACTION IS NOW: ${status}`);

    } catch (e) {
        console.log(e);
        repondre("❌ Error toggling auto reaction");
    }
});

// ===============================
// ⚡ MESSAGE REACTION HANDLER
// (Hook hii iweke kwenye main message handler)
// ===============================
async function handleReaction(zk, msg) {
    try {
        if (!global.autoReact) return;

        let text =
            msg.message?.conversation ||
            msg.message?.extendedTextMessage?.text ||
            "";

        if (!text) return;

        let emoji = "🤖";

        // simple logic
        if (text.includes("love")) emoji = "❤️";
        else if (text.includes("lol") || text.includes("haha")) emoji = "😂";
        else if (text.includes("wow")) emoji = "😮";
        else if (text.includes("sad")) emoji = "😢";
        else if (text.includes("fire")) emoji = "🔥";

        await zk.sendMessage(msg.key.remoteJid, {
            react: {
                text: emoji,
                key: msg.key
            }
        });

    } catch (e) {
        console.log("Auto reaction error:", e);
    }
}

// ===============================
// EXPORT HANDLER
// ===============================
module.exports = {
    handleReaction
};
