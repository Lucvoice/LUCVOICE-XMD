const { zokou } = require(__dirname + "/../framework/zokou");

zokou({ nomCom: "restart", categorie: "System" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, auteurMessage } = commandeOptions;

    try {
        // ⚠️ Only owner can restart
        let ownerNumber = global.owner || "";

        if (!ownerNumber.includes(auteurMessage.split("@")[0])) {
            return repondre("❌ Only the bot owner can restart this bot.");
        }

        await repondre("🔄 Restarting LUCVOICE-XMD bot... please wait");

        // Small delay before restart message
        setTimeout(() => {
            process.on("exit", () => {
                require("child_process").spawn(process.argv.shift(), process.argv, {
                    cwd: process.cwd(),
                    detached: true,
                    stdio: "inherit"
                });
            });

            process.exit();
        }, 2000);

    } catch (e) {
        console.log("Restart error:", e);
        repondre("❌ Error during restart");
    }
});
