const { zokou } = require(__dirname + "/../framework/zokou");

zokou({ nomCom: "repo", categorie: "Info" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre } = commandeOptions;

    try {
        let repoLink = "https://github.com/lucvoice/LUCVOICE-XMD";

        let caption = `
╭━━〔 📦 LUCVOICE-XMD REPO 〕━━╮
┃ 🤖 Bot : LUCVOICE-XMD
┃ 👑 Owner : LUCVOICE
┃ 🌐 GitHub : ${repoLink}
╰━━━━━━━━━━━━━━━━━━━━━━╯

📌 Features:
✔ WhatsApp Bot (Baileys)
✔ AI System 🤖
✔ Games 🎮
✔ Group Tools 👥
✔ Downloader 📥

⭐ Star the repo if you like it!
`;

        let imageUrl = "https://files.catbox.moe/t21l69.png"; // unaweza kubadilisha

        await zk.sendMessage(dest, {
            image: { url: imageUrl },
            caption: caption
        }, { quoted: ms });

    } catch (e) {
        console.log("Repo error:", e);
        repondre("❌ Error showing repo info");
    }
});
