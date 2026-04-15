const { zokou } = require("../framework/zokou");
const s = require("../set");

zokou({
    nomCom: "reboot",
    categorie: "System",
    reaction: "♻️",
    desc: "Restart the bot"
}, async (dest, zk, commandeOptions) => {

    const { ms, repondre, superUser } = commandeOptions;

    // 🔐 Only owner can use
    if (!superUser) {
        return repondre("❌ Only owner can reboot the bot!");
    }

    try {
        await repondre("♻️ Rebooting bot... please wait");

        // small delay before restart message sends
        setTimeout(() => {
            process.exit(1); // forces restart (works with PM2 / hosting auto-restart)
        }, 2000);

    } catch (e) {
        console.log("Reboot error:", e);
        repondre("❌ Failed to reboot bot");
    }
});
