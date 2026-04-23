const { zokou } = require("../framework/zokou");

zokou({
    nomCom: "ping",
    categorie: "General",
    reaction: "🏓"
}, async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;

    const start = Date.now();
    const speed = Date.now() - start;

    const msg = `
╭━━━〔 🏓 LUCVOICE-XMD 〕━━━╮
┃ ⚡ SPEED   : ${speed} ms
┃ 🚀 STATUS  : ONLINE
╰━━━━━━━━━━━━━━━━━━━━╯
`;

    const imageUrl = "https://files.catbox.moe/vhre8c.png";

    try {
        await zk.sendMessage(dest, {
            image: { url: imageUrl },
            caption: msg
        }, { quoted: ms });

    } catch (e) {
        console.log("Ping Error:", e);

        await zk.sendMessage(dest, {
            text: msg
        }, { quoted: ms });
    }
});
