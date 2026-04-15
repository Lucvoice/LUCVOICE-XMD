const { zokou } = require(__dirname + "/../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");

zokou({ nomCom: "status", categorie: "System" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre } = commandeOptions;

    try {
        moment.tz.setDefault("Africa/Dar_es_Salaam");

        let uptime = process.uptime();
        let hours = Math.floor(uptime / 3600);
        let minutes = Math.floor((uptime % 3600) / 60);
        let seconds = Math.floor(uptime % 60);

        let ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        let totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

        let nodeVersion = process.version;

        let text = `
╭━━〔 🤖 LUCVOICE-XMD STATUS 〕━━╮
┃ ⚡ Uptime : ${hours}h ${minutes}m ${seconds}s
┃ 💾 RAM    : ${ramUsed} MB
┃ 🖥️ Total  : ${totalRam} GB
┃ 🧠 Node   : ${nodeVersion}
┃ 🌍 OS     : ${os.platform()}
┃ 📊 Arch   : ${os.arch()}
╰━━━━━━━━━━━━━━━━━━━━━━╯

🚀 Bot is running smoothly...
`;

        await zk.sendMessage(dest, {
            text: text
        }, { quoted: ms });

    } catch (e) {
        console.log("Status error:", e);
        repondre("❌ Error getting bot status");
    }
});
