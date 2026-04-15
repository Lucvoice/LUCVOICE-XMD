const { zokou } = require(__dirname + "/../framework/zokou");

zokou({ nomCom: "pair", categorie: "System" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre } = commandeOptions;

    try {
        let link = "https://lucvoice-xmd.onrender.com";

        let text = `
╭━━〔 🔗 LUCVOICE-XMD PAIR SYSTEM 〕━━╮
┃ 🤖 Bot Name : LUCVOICE-XMD
┃ 👑 Owner    : LUCVOICE
┃ 🌐 Server   : Render Hosting
╰━━━━━━━━━━━━━━━━━━━━━━╯

📌 *PAIRING LINK:*
${link}

📲 Steps:
1. Open the link above
2. Generate pairing code / QR
3. Connect your WhatsApp session
4. Bot will go online automatically 🚀

⚠️ Do NOT share your session code with anyone!
`;

        await zk.sendMessage(dest, {
            text: text
        }, { quoted: ms });

    } catch (e) {
        console.log("Pair error:", e);
        repondre("❌ Error generating pair info");
    }
});
