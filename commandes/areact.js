const { zokou } = require(__dirname + "/../framework/zokou");

// ===============================
// 🤖 AUTO REACTION TOGGLE
// ===============================
zokou({ nomCom: "areact", categorie: "Fun" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre } = commandeOptions;

    try {
        global.AUTO_REACT = global.AUTO_REACT || false;

        global.AUTO_REACT = !global.AUTO_REACT;

        let status = global.AUTO_REACT ? "ON 🟢" : "OFF 🔴";

        return repondre(
`🤖 *LUCVOICE-XMD AUTO REACT*

Status: ${status}
✨ Auto reactions updated successfully!`
        );

    } catch (e) {
        console.log("Areact error:", e);
        repondre("❌ Error toggling auto reaction");
    }
});

// ===============================
// ⚡ AUTO REACTION HANDLER
// 👉 Add this in your main message handler
// ===============================
async function autoReact(zk, msg) {
    try {
        if (!global.AUTO_REACT) return;

        let text =
            msg.message?.conversation ||
            msg.message?.extendedTextMessage?.text ||
            "";

        if (!text) return;

        let emoji = "🤖";

        // Smart reaction rules
        if (text.includes("love")) emoji = "❤️";
        else if (text.includes("lol") || text.includes("haha")) emoji = "😂";
        else if (text.includes("wow")) emoji = "😮";
        else if (text.includes("sad")) emoji = "😢";
        else if (text.includes("fire")) emoji = "🔥";
        else if (text.includes("yes")) emoji = "👍";
        else if (text.includes("no")) emoji = "👎";

        await zk.sendMessage(msg.key.remoteJid, {
            react: {
                text: emoji,
                key: msg.key
            }
        });

    } catch (e) {
        console.log("Auto react error:", e);
    }
}

// ===============================
// EXPORT FUNCTION
// ===============================
module.exports = {
    autoReact
};
