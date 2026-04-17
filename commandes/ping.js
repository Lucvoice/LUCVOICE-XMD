const { zokou } = require("../framework/zokou");
const sila = require("../ʟᴜᴄᴠᴏɪᴄᴇ/ʟᴜᴄᴠᴏɪᴄᴇ");

zokou({
    nomCom: "ping",
    aliases: ["pong", "speed"],
    reaction: "🏓",
    categorie: "General",
    desc: "Check bot response speed"
}, async (dest, zk, commandeOptions) => {

    const { ms } = commandeOptions;
    const config = sila.getConfig();

    const start = Date.now();
    await zk.sendMessage(dest, { text: "🏓 Checking ping..." }, { quoted: ms });
    const latency = Date.now() - start;

    await zk.sendMessage(dest, {
        text: " ",
        contextInfo: {
            externalAdReply: {
                title: config.botName,
                body: `🏓 PONG! ${latency} ms`,
                mediaType: 1,
                previewType: 0,
                thumbnailUrl: config.botPic,
                sourceUrl: `https://wa.me/${config.ownerNumber}`,
                renderLargerThumbnail: false
            }
        }
    }, { quoted: ms });

});
